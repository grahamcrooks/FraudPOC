"""Shared data loading and the aggregate signals the current event strategies use.

Every window looks backwards from the claim being scored: a claim only
sees claims submitted at or before its own submission time. That is what
a real-time rule can know, and it matters again in Stage 5 (leakage).
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"


def load(with_truth: bool = True) -> pd.DataFrame:
    """Claims joined to member details, optionally with the truth columns."""
    claims = pd.read_csv(DATA / "claims.csv", parse_dates=["submitted_at", "service_date"],
                         dtype={"payee_bsb": str, "payee_account": str})
    members = pd.read_csv(DATA / "members.csv", parse_dates=["join_date"])
    df = claims.merge(members[["member_id", "age", "join_date", "city", "home_lat", "home_lon"]],
                      on="member_id", how="left")
    if with_truth:
        truth = pd.read_csv(DATA / "claims_truth.csv", keep_default_na=False)
        df = df.merge(truth, on="claim_id", how="left")
    return df


def _rolling_distinct(df: pd.DataFrame, group_col: str, value_col: str, window: pd.Timedelta) -> np.ndarray:
    """For each claim, distinct values of value_col within its group over the trailing window."""
    out = np.zeros(len(df), dtype=int)
    t_all = df["submitted_at"].to_numpy()
    for idx in df.groupby(group_col, sort=False).indices.values():
        idx = idx[np.argsort(t_all[idx], kind="stable")]
        if len(idx) == 1:
            out[idx] = 1
            continue
        t = t_all[idx]
        v = df[value_col].to_numpy()[idx]
        left = np.searchsorted(t, t - window.to_timedelta64(), side="left")
        for j in range(len(idx)):
            out[idx[j]] = len(set(v[left[j]:j + 1]))
    return out


MEMBER_LODGED = ("app", "web", "kiosk")


def device_members_72h(df: pd.DataFrame) -> np.ndarray:
    """Distinct members who lodged from this device in the 72 hours up to this claim.

    Only member-lodged claims (app, web, reception kiosk) carry a meaningful
    device fingerprint; a practice's payment terminal is shared by every
    patient by design. Point-of-sale claims get 0, meaning "not applicable".
    """
    out = np.zeros(len(df), dtype=int)
    mask = df["channel"].isin(MEMBER_LODGED).to_numpy()
    sub = df[mask]
    out[mask] = _rolling_distinct(sub, "device_fingerprint", "member_id", pd.Timedelta(hours=72))
    return out


def account_practices_30d(df: pd.DataFrame) -> np.ndarray:
    """Distinct practices paying into this BSB and account in the 30 days up to this claim."""
    key = df["payee_bsb"] + "|" + df["payee_account"]
    return _rolling_distinct(df.assign(_acct=key), "_acct", "practice_id", pd.Timedelta(days=30))


def haversine_km(lat1, lon1, lat2, lon2) -> np.ndarray:
    lat1, lon1, lat2, lon2 = map(np.radians, (lat1, lon1, lat2, lon2))
    a = np.sin((lat2 - lat1) / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin((lon2 - lon1) / 2) ** 2
    return 6371.0 * 2 * np.arcsin(np.sqrt(a))


def submission_distance_km(df: pd.DataFrame) -> np.ndarray:
    """Distance from the submission IP's geolocation to the member's registered address."""
    return haversine_km(df["home_lat"], df["home_lon"], df["ip_lat"], df["ip_lon"])
