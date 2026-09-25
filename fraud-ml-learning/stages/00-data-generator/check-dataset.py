"""Stage 0: check the generated dataset does what it claims.

Prints the shape of the data, the planted fraud, the confounders, and how
well the three current rule signals separate fraud from honest behaviour
at naive thresholds. Writes figures to figures/ and the printed output to
output.txt, which NOTES.md quotes.

Run from the fraud-ml-learning folder, after python src/generate.py:
    python stages/00-data-generator/check-dataset.py
"""

import io
import sys
from contextlib import redirect_stdout
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1]))
from src.features import (DATA, account_practices_30d, device_members_72h, load,  # noqa: E402
                          submission_distance_km)

FIG = HERE / "figures"
CLEAN, FRAUD, SPECIAL, MUTED = "#2a78d6", "#eb6834", "#1baf7a", "#a3a29c"
INK, INK2 = "#0b0b0b", "#52514e"

plt.rcParams.update({
    "font.size": 10, "axes.edgecolor": "#d9d8d3", "axes.labelcolor": INK2, "xtick.color": INK2,
    "ytick.color": INK2, "axes.spines.top": False, "axes.spines.right": False,
    "axes.grid": True, "grid.color": "#ecebe7", "grid.linewidth": 0.8, "axes.axisbelow": True,
    "figure.facecolor": "#fcfcfb", "axes.facecolor": "#fcfcfb", "axes.titlecolor": INK,
    "axes.titlesize": 11, "legend.frameon": False,
})


def section(title):
    print(f"\n{title}\n{'-' * len(title)}")


def main():
    df = load()
    members = pd.read_csv(DATA / "members.csv")
    practices = pd.read_csv(DATA / "practices.csv")
    ptruth = pd.read_csv(DATA / "practices_truth.csv", keep_default_na=False)
    mtruth = pd.read_csv(DATA / "members_truth.csv", keep_default_na=False)
    n_prac = len(pd.read_csv(DATA / "practitioners.csv"))

    section("Size")
    print(f"claims          {len(df):>7,}")
    print(f"members         {len(members):>7,}  in {members.membership_id.nunique():,} memberships")
    print(f"practices       {len(practices):>7,}  with {n_prac:,} practitioners")
    print(f"submitted       {df.submitted_at.min():%d %b %Y} to {df.submitted_at.max():%d %b %Y}")
    print("channel mix     " + ", ".join(f"{k} {v:.0%}" for k, v in df.channel.value_counts(normalize=True).items()))
    print("claim type mix  " + ", ".join(f"{k} {v:.0%}" for k, v in df.claim_type.value_counts(normalize=True).items()))

    section("Planted fraud")
    print(f"fraud claims {df.is_fraud.sum()} of {len(df):,} = {df.is_fraud.mean():.2%}")
    print(df.fraud_pattern.value_counts().rename("claims").to_string())
    both = df[(df.device_ring_id != "") & (df.bank_ring_id != "")]
    print(f"claims carrying both a device-ring and a bank-ring id: {len(both)}")
    rings = df[df.is_fraud == 1].melt(id_vars="member_id", value_vars=["device_ring_id", "bank_ring_id"])
    per_member = rings[rings.value != ""].groupby("member_id").value.nunique()
    print(f"ring members: {len(per_member)}, of whom in more than one ring: {(per_member > 1).sum()}")
    print(f"ring members who are synthetic identities: "
          f"{mtruth.set_index('member_id').loc[per_member.index].synthetic_identity.sum()}")
    by_month = df.groupby(df.submitted_at.dt.to_period("M")).is_fraud.agg(["sum", "mean"])
    print("fraud by month (claims, rate): " + ", ".join(f"{p.strftime('%b')} {int(s)} ({m:.1%})"
                                                        for p, (s, m) in by_month.iterrows()))

    section("Honest confounders (clean claims carrying each context)")
    ctx = df[df.is_fraud == 0].legit_context.str.split(";").explode()
    print(ctx[ctx != ""].value_counts().to_string())
    print(f"clean claims with no special context: {(df[df.is_fraud == 0].legit_context == '').sum():,}")

    # --- the three current rule signals ---------------------------------
    df["device_members_72h"] = device_members_72h(df)
    df["account_practices_30d"] = account_practices_30d(df)
    df["distance_km"] = submission_distance_km(df)

    section("Naive rule thresholds: what do they flag?")
    rules = [("device_members_72h", 3, "device_ring", "3+ members on one device in 72h"),
             ("account_practices_30d", 3, "bank_ring", "3+ practices into one account in 30d"),
             ("distance_km", 500, "distance", "lodged 500+ km from home")]
    for col, th, pattern, label in rules:
        flag = df[col] >= th
        own = df.fraud_pattern == pattern
        fp_ctx = df[flag & (df.is_fraud == 0)].legit_context.str.split(";").explode()
        fp_ctx = fp_ctx.replace("", "(no special context)").value_counts()
        print(f"\n{label}")
        print(f"  flagged {flag.sum():,} claims; fraud among them {df[flag].is_fraud.sum()} "
              f"({df[flag].is_fraud.mean():.1%} precision)")
        print(f"  planted {pattern} claims caught: {(flag & own).sum()} of {own.sum()} ({(flag & own).sum() / own.sum():.0%})")
        print("  clean claims flagged, by context: " + ", ".join(f"{k} {v}" for k, v in fp_ctx.head(6).items()))
    any_flag = np.column_stack([df[c] >= t for c, t, _, _ in rules]).any(axis=1)
    print(f"\nany of the three: flagged {any_flag.sum():,}, fraud {df[any_flag].is_fraud.sum()} "
          f"({df[any_flag].is_fraud.mean():.1%}); fraud caught {df[any_flag].is_fraud.sum()} of {df.is_fraud.sum()}")
    print("upcoding claims flagged by any rule: "
          f"{(any_flag & (df.fraud_pattern == 'upcoding')).sum()} of {(df.fraud_pattern == 'upcoding').sum()}")
    df["_away_member"] = df.distance_km >= 500
    missed = df[(df.fraud_pattern == "distance") & ~df._away_member]
    print(f"distance fraud that does not look far: {len(missed)} "
          f"(ip in {', '.join(missed.ip_city.value_counts().index[:4])})")
    os_legit = ((df.ip_country != "AU") & (df.is_fraud == 0)).sum()
    os_fraud = ((df.ip_country != "AU") & (df.is_fraud == 1)).sum()
    print(f"claims lodged from an overseas IP: {os_legit + os_fraud} ({os_fraud} fraud, {os_legit} clean)")

    section("Claim-level preview (for Stage 2)")
    print(df.groupby("is_fraud").amount.describe()[["50%", "mean", "75%"]].round(0).to_string())
    print((pd.crosstab(df.channel, df.is_fraud, normalize="columns") * 100).round(1).to_string())

    section("Billing profiles (dental practices, mean amount per claim)")
    dental = df[df.claim_type == "dental"].merge(ptruth, on="practice_id")
    prof = dental.groupby(["practice_id", "profile"]).agg(claims=("amount", "size"), mean_amount=("amount", "mean"),
                                                          fraud=("is_fraud", "sum")).reset_index()
    prof = prof[prof.claims >= 30]
    print(prof.groupby("profile").mean_amount.describe()[["count", "50%", "min", "max"]].round(0).to_string())
    normal = prof[prof.profile == "normal"].mean_amount
    for _, r in prof[prof.profile != "normal"].sort_values("mean_amount").iterrows():
        pct = (normal < r.mean_amount).mean()
        print(f"  {r.practice_id} {r.profile:<10} ${r.mean_amount:,.0f} per claim, higher than {pct:.0%} of normal practices")

    make_figures(df, prof)


def make_figures(df, prof):
    FIG.mkdir(exist_ok=True)
    fig, axes = plt.subplots(1, 3, figsize=(13, 4.0))
    specs = [("device_members_72h", "device_ring", "Members on one device, last 72h", np.arange(0.5, 9.5)),
             ("account_practices_30d", "bank_ring", "Practices into one account, last 30d", np.arange(0.5, 17.5)),
             ("distance_km", "distance", "Distance lodged from home (km)", np.logspace(0, 4.3, 30))]
    for ax, (col, pattern, title, bins) in zip(axes, specs):
        clean = df.loc[df.is_fraud == 0, col]
        fraud = df.loc[df.fraud_pattern == pattern, col]
        if col == "device_members_72h":  # point-of-sale claims have no member device
            clean = clean[df.channel.isin(["app", "web", "kiosk"])]
            ax.set_xlabel("0 = point of sale, not applicable; shown from 1")
        if col == "account_practices_30d":  # fold the long corporate tail into the last bar
            clean, fraud = clean.clip(upper=16), fraud.clip(upper=16)
            ax.set_xticks([1, 4, 8, 12, 16], ["1", "4", "8", "12", "16+"])
            ax.set_xlabel("16+ is corporate chains and large groups")
        ax.hist(clean, bins=bins, histtype="step", lw=2, color=CLEAN, label="Clean claims")
        ax.hist(fraud, bins=bins, histtype="step", lw=2, color=FRAUD, label="Planted fraud of that pattern")
        ax.set_yscale("log")
        ax.set_ylim(0.8, None)
        ax.set_title(title, loc="left")
        if col == "distance_km":
            ax.set_xscale("log")
            ax.set_xlabel("Log scale; regional IPs often resolve to the capital")
    axes[0].set_ylabel("Claims (log scale)")
    handles, labels = axes[0].get_legend_handles_labels()
    fig.legend(handles, labels, loc="upper right", ncol=2)
    fig.suptitle("Where fraud lives, honest claims usually outnumber it",
                 x=0.01, ha="left", fontsize=12, color=INK)
    fig.tight_layout(rect=(0, 0, 1, 0.94))
    fig.savefig(FIG / "signal-overlap.png", dpi=150)
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(9, 3.2))
    order = {"normal": 0, "specialist": 1, "upcoder": 2}
    colours = {"normal": MUTED, "specialist": SPECIAL, "upcoder": FRAUD}
    labels = {"normal": "Normal practice", "specialist": "Specialist (legitimate)", "upcoder": "Upcoder (fraud)"}
    for profile, g in prof.groupby("profile"):
        y = order[profile] + rng_jitter(len(g))
        ax.scatter(g.mean_amount, y, s=34 if profile != "normal" else 16, color=colours[profile],
                   edgecolor="#fcfcfb", linewidth=1, label=labels[profile], zorder=3)
    ax.set_yticks(list(order.values()), [labels[k] for k in order])
    ax.set_xlabel("Mean amount per dental claim (AUD), practices with 30+ claims")
    ax.set_title("Upcoders hide among honest practices; specialists look more suspicious than they do", loc="left")
    ax.grid(axis="y", visible=False)
    fig.tight_layout()
    fig.savefig(FIG / "billing-profiles.png", dpi=150)
    plt.close(fig)


def rng_jitter(n):
    return np.random.default_rng(0).uniform(-0.18, 0.18, n)


if __name__ == "__main__":
    buf = io.StringIO()
    with redirect_stdout(buf):
        main()
    (HERE / "output.txt").write_text(buf.getvalue())
    print(buf.getvalue())
