"""Synthetic extras claims generator (Stage 0).

Builds about 50,000 extras claims for one financial year (1 July 2025 to
30 June 2026) at a fraud rate of about 1%, and writes them to data/.

Two kinds of output, kept deliberately apart:

  Observable files: what a fund would actually hold when a claim arrives.
    claims.csv, members.csv, practices.csv, practitioners.csv

  Truth files: what only the generator knows. Never use these as model
  inputs; they exist so later stages can score models and explain errors.
    claims_truth.csv, members_truth.csv, practices_truth.csv

Planted fraud (fraud_pattern in claims_truth.csv):
  device_ring  one device, several unrelated members, short window
  bank_ring    one account, several unrelated practices
  distance     submitted far from the member's registered address
  upcoding     practice bills a higher-value item than it delivered
               (the pattern the current rules do not look for)

Honest confounders (legit_context in claims_truth.csv) exist to make the
first three patterns genuinely hard to separate from ordinary behaviour.
Each one is described where it is built below.

Everything is fictional. BSBs use the unassigned 000 prefix, IP addresses
come from private (10/8) and shared (100.64/10) ranges, and provider
numbers use a made-up PRV- format.

Run from the fraud-ml-learning folder:  python src/generate.py
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

SEED = 20250701
FY_START = datetime(2025, 7, 1)
FY_END = datetime(2026, 7, 1)  # exclusive
FY_DAYS = (FY_END - FY_START).days

N_MEMBERSHIPS = 8_000
N_PRACTICES = 650
CLAIM_RATE_SCALE = 1.15  # tuned so the total lands near 50,000 claims

rng = np.random.default_rng(SEED)

# ---------------------------------------------------------------------------
# Geography. Real city centroids (public facts); everything placed around
# them is synthetic.
# ---------------------------------------------------------------------------

# name, state, lat, lon, population weight, metro?
CITIES = [
    ("Sydney", "NSW", -33.87, 151.21, 0.210, True),
    ("Melbourne", "VIC", -37.81, 144.96, 0.200, True),
    ("Brisbane", "QLD", -27.47, 153.03, 0.100, True),
    ("Perth", "WA", -31.95, 115.86, 0.080, True),
    ("Adelaide", "SA", -34.93, 138.60, 0.055, True),
    ("Canberra", "ACT", -35.28, 149.13, 0.018, True),
    ("Hobart", "TAS", -42.88, 147.33, 0.010, True),
    ("Darwin", "NT", -12.46, 130.84, 0.006, True),
    ("Gold Coast", "QLD", -28.02, 153.40, 0.030, True),
    ("Newcastle", "NSW", -32.93, 151.78, 0.025, False),
    ("Wollongong", "NSW", -34.42, 150.89, 0.012, False),
    ("Geelong", "VIC", -38.15, 144.36, 0.012, False),
    ("Sunshine Coast", "QLD", -26.65, 153.07, 0.015, False),
    ("Townsville", "QLD", -19.26, 146.82, 0.007, False),
    ("Cairns", "QLD", -16.92, 145.77, 0.006, False),
    ("Toowoomba", "QLD", -27.56, 151.95, 0.006, False),
    ("Ballarat", "VIC", -37.56, 143.85, 0.005, False),
    ("Bendigo", "VIC", -36.76, 144.28, 0.005, False),
    ("Albury", "NSW", -36.08, 146.92, 0.004, False),
    ("Launceston", "TAS", -41.43, 147.14, 0.004, False),
    ("Mackay", "QLD", -21.14, 149.19, 0.004, False),
    ("Wagga Wagga", "NSW", -35.12, 147.37, 0.003, False),
    ("Dubbo", "NSW", -32.25, 148.60, 0.003, False),
    ("Bunbury", "WA", -33.33, 115.64, 0.003, False),
    ("Mildura", "VIC", -34.19, 142.16, 0.002, False),
    ("Port Macquarie", "NSW", -31.43, 152.91, 0.003, False),
    ("Tamworth", "NSW", -31.09, 150.93, 0.003, False),
    ("Orange", "NSW", -33.28, 149.10, 0.003, False),
    ("Kalgoorlie", "WA", -30.75, 121.47, 0.0015, False),
    ("Alice Springs", "NT", -23.70, 133.88, 0.001, False),
]
CITY = {c[0]: dict(state=c[1], lat=c[2], lon=c[3], w=c[4], metro=c[5]) for c in CITIES}
CITY_NAMES = [c[0] for c in CITIES]
CITY_W = np.array([c[4] for c in CITIES]) / sum(c[4] for c in CITIES)
CAPITAL = {"NSW": "Sydney", "VIC": "Melbourne", "QLD": "Brisbane", "WA": "Perth",
           "SA": "Adelaide", "ACT": "Canberra", "TAS": "Hobart", "NT": "Darwin"}
NATIONAL_HUBS = ["Sydney", "Melbourne"]
RING_CITIES = ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast"]
RING_CITY_W = np.array([0.32, 0.28, 0.14, 0.10, 0.08, 0.08])

FIFO_SITES = {"Karratha": (-20.74, 116.85), "Port Hedland": (-20.31, 118.61),
              "Mount Isa": (-20.73, 139.49), "Moranbah": (-22.00, 148.05)}
FIFO_HOME_CITIES = ["Perth", "Bunbury", "Brisbane", "Mackay", "Townsville", "Cairns"]

# Overseas locations: (city, country, lat, lon, traveller weight, fraudster weight).
# The two weightings overlap on purpose, so country alone is a weak signal.
OVERSEAS = [
    ("Auckland", "NZ", -36.85, 174.76, 0.18, 0.05),
    ("Denpasar", "ID", -8.65, 115.22, 0.14, 0.05),
    ("Los Angeles", "US", 34.05, -118.24, 0.10, 0.10),
    ("London", "GB", 51.51, -0.13, 0.10, 0.10),
    ("Tokyo", "JP", 35.68, 139.69, 0.10, 0.03),
    ("Bangkok", "TH", 13.76, 100.50, 0.08, 0.05),
    ("Nadi", "FJ", -17.80, 177.42, 0.05, 0.02),
    ("Singapore", "SG", 1.35, 103.82, 0.06, 0.05),
    ("Ho Chi Minh City", "VN", 10.82, 106.63, 0.06, 0.10),
    ("Rome", "IT", 41.90, 12.50, 0.05, 0.03),
    ("Manila", "PH", 14.60, 120.98, 0.03, 0.12),
    ("Kuala Lumpur", "MY", 3.14, 101.69, 0.02, 0.08),
    ("Mumbai", "IN", 19.08, 72.88, 0.02, 0.12),
    ("Shanghai", "CN", 31.23, 121.47, 0.02, 0.10),
]
OS_TRAVEL_W = np.array([o[4] for o in OVERSEAS]); OS_TRAVEL_W /= OS_TRAVEL_W.sum()
OS_FRAUD_W = np.array([o[5] for o in OVERSEAS]); OS_FRAUD_W /= OS_FRAUD_W.sum()
VPN_EXITS = [("Sydney", "AU", -33.87, 151.21), ("Melbourne", "AU", -37.81, 144.96),
             ("Singapore", "SG", 1.35, 103.82), ("Los Angeles", "US", 34.05, -118.24),
             ("London", "GB", 51.51, -0.13), ("Tokyo", "JP", 35.68, 139.69)]

STREETS = ["Wattle", "Banksia", "Acacia", "Grevillea", "Jacaranda", "Bottlebrush", "Paperbark",
           "Ironbark", "Kurrajong", "Waratah", "Boronia", "Casuarina", "Lilly Pilly", "Correa",
           "Hakea", "Melaleuca", "Tea Tree", "Blackwood", "Myrtle", "Saltbush"]
STREET_TYPES = ["St", "Rd", "Ave", "Cres", "Pl", "Ct", "Way", "Pde"]

# ---------------------------------------------------------------------------
# Services, item codes and fees. Dental codes follow the public ADA schedule;
# the other modalities use illustrative codes. Fees are typical AUD charges.
# ---------------------------------------------------------------------------

BASE_FEE = {
    "011": 95, "012": 70, "013": 55, "022": 45, "111": 70, "114": 135, "115": 185,
    "121": 40, "311": 230, "415": 480, "521": 175, "531": 175, "532": 225, "533": 275,
    "615": 1650,
    "PH500": 115, "PH505": 95, "PH506": 140, "PH560": 40,
    "CH100": 90, "CH110": 65, "CH120": 85,
    "OP201": 220, "OP211": 180, "OP215": 520, "OP230": 300,
    "PS300": 230, "PS310": 290,
    "PD400": 95, "PD410": 75, "PD450": 480,
    "RM500": 75, "RM510": 115,
}

# (weight, items) visit templates per modality: "normal" practices, and the
# high-value mix used by specialist practices and by fraudsters.
TEMPLATES = {
    "dental": {
        "normal": [(0.45, ["012", "114", "121"]), (0.08, ["011", "114", "121", "022", "022"]),
                   (0.10, ["013", "531"]), (0.07, ["013", "532"]), (0.03, ["013", "533"]),
                   (0.05, ["013", "311"]), (0.04, ["415"]), (0.04, ["615"]),
                   (0.14, ["114", "121"])],
        "high": [(0.20, ["012", "115", "121", "022", "022"]), (0.15, ["013", "532"]),
                 (0.15, ["013", "533"]), (0.15, ["415"]), (0.15, ["615"]),
                 (0.20, ["115", "121"])],
    },
    "physio": {"normal": [(0.20, ["PH500"]), (0.65, ["PH505"]), (0.10, ["PH506"]), (0.05, ["PH560"])],
               "high": [(0.20, ["PH500"]), (0.30, ["PH505"]), (0.50, ["PH506"])]},
    "chiro": {"normal": [(0.12, ["CH100"]), (0.80, ["CH110"]), (0.08, ["CH120"])],
              "high": [(0.15, ["CH100"]), (0.45, ["CH110"]), (0.40, ["CH120"])]},
    "optical": {"normal": [(0.60, ["OP201", "OP211"]), (0.20, ["OP201", "OP215"]),
                           (0.15, ["OP230"]), (0.05, ["OP211"])],
                "high": [(0.25, ["OP201", "OP211"]), (0.55, ["OP201", "OP215"]), (0.20, ["OP230"])]},
    "psych": {"normal": [(0.85, ["PS300"]), (0.15, ["PS310"])],
              "high": [(0.50, ["PS300"]), (0.50, ["PS310"])]},
    "podiatry": {"normal": [(0.15, ["PD400"]), (0.70, ["PD410"]), (0.15, ["PD450"])],
                 "high": [(0.15, ["PD400"]), (0.40, ["PD410"]), (0.45, ["PD450"])]},
    "massage": {"normal": [(0.35, ["RM500"]), (0.65, ["RM510"])],
                "high": [(0.10, ["RM500"]), (0.90, ["RM510"])]},
}
# What an upcoding practice swaps a delivered item for.
UPCODE = {"012": "011", "013": "012", "114": "115", "111": "114", "531": "532", "532": "533",
          "PH505": "PH506", "CH110": "CH120", "PD410": "PD400", "RM500": "RM510"}

MODALITIES = ["dental", "physio", "chiro", "optical", "psych", "podiatry", "massage"]
PRACTICE_MIX = [0.35, 0.20, 0.12, 0.12, 0.08, 0.07, 0.06]
MODALITY_BY_AGE = {
    "child": [0.62, 0.08, 0.04, 0.14, 0.06, 0.04, 0.02],
    "adult": [0.36, 0.20, 0.12, 0.10, 0.07, 0.05, 0.10],
    "older": [0.32, 0.18, 0.08, 0.18, 0.03, 0.14, 0.07],
}
FRAUD_MODALITY = [0.35, 0.12, 0.08, 0.35, 0.00, 0.10, 0.00]


# ---------------------------------------------------------------------------
# Small helpers
# ---------------------------------------------------------------------------

def h(key: str, n: int = 16) -> str:
    return hashlib.sha1(key.encode()).hexdigest()[:n]


def fake_ip(key: str, kind: str) -> str:
    """Deterministic non-routable IP. Mobile carriers use shared 100.64/10 space."""
    b = hashlib.sha1(key.encode()).digest()
    if kind == "mobile":
        return f"100.{64 + b[0] % 64}.{b[1]}.{b[2]}"
    return f"10.{b[0]}.{b[1]}.{max(b[2], 1)}"


def jitter(lat: float, lon: float, km: float) -> tuple[float, float]:
    d = rng.normal(0, km / 111, 2)
    return lat + d[0], lon + d[1] / max(np.cos(np.radians(lat)), 0.2)


def pick(weighted):
    w = np.array([x[0] for x in weighted], float)
    return weighted[rng.choice(len(weighted), p=w / w.sum())][1]


def rand_day(lo: datetime, hi: datetime) -> datetime:
    days = max((hi - lo).days, 1)
    return (lo + timedelta(days=int(rng.integers(0, days)))).replace(hour=0, minute=0, second=0)


def at_time(day: datetime, hour: float) -> datetime:
    return day.replace(hour=0, minute=0, second=0) + timedelta(seconds=int(hour * 3600) + int(rng.integers(0, 60)))


def appointment_hour() -> float:
    return float(rng.uniform(8, 18))


def evening_hour() -> float:
    # People lodge claims in the evening, at lunch, and occasionally late.
    return float(pick([(0.55, rng.uniform(18.5, 22.5)), (0.25, rng.uniform(11.5, 14)),
                       (0.15, rng.uniform(7, 18)), (0.05, rng.uniform(22.5, 23.99))]))


def fiscal_clip(d: datetime) -> datetime:
    return min(max(d, FY_START), FY_END - timedelta(days=1))


# ---------------------------------------------------------------------------
# Entities
# ---------------------------------------------------------------------------

@dataclass
class Account:
    account_id: str
    bsb: str
    number: str
    owner: str  # "membership", "practice", "chain", "owner", "ring", "fraudster"


@dataclass
class Practice:
    practice_id: str
    name: str
    modality: str
    city: str
    lat: float
    lon: float
    size: float
    account: Account
    fees: dict
    ip_geo: tuple  # (city, country, lat, lon) the practice's broadband geolocates to
    profile: str = "normal"  # normal | specialist | upcoder
    kiosk: bool = False
    group: str = ""  # chain or multi-site owner id
    practitioners: list = field(default_factory=list)


@dataclass
class Membership:
    membership_id: str
    city: str
    lat: float
    lon: float
    address: str
    account: Account
    members: list = field(default_factory=list)
    tablet: bool = False
    trips: list = field(default_factory=list)  # (start, end, kind, geo)
    move: tuple | None = None  # (date, new city)
    payee_override: Account | None = None  # extended-family account
    carer: "Member | None" = None  # someone in another membership who lodges for them


@dataclass
class Member:
    member_id: str
    ms: Membership
    age: int
    join_date: datetime
    role: str  # primary, partner, child, adult_child
    rate: float = 0.0
    p_pos: float = 0.6
    vpn: tuple | None = None
    fifo: tuple | None = None  # (site name, offset days)
    phone_change: datetime | None = None
    synthetic: bool = False
    home_practice: dict = field(default_factory=dict)
    truth: set = field(default_factory=set)

    @property
    def age_group(self):
        return "child" if self.age < 18 else ("older" if self.age >= 60 else "adult")


_acct_n = 0


def new_account(owner: str) -> Account:
    global _acct_n
    _acct_n += 1
    return Account(f"A{_acct_n:06d}", f"000-{rng.integers(100, 1000)}",
                   f"{rng.integers(10_000_000, 99_999_999)}", owner)


# ---------------------------------------------------------------------------
# Build practices
# ---------------------------------------------------------------------------

def build_practices() -> list[Practice]:
    practices: list[Practice] = []
    counts = {c: max(3, int(round(N_PRACTICES * w))) for c, w in zip(CITY_NAMES, CITY_W)}
    n = 0
    for city, k in counts.items():
        c = CITY[city]
        # guarantee the common modalities exist in every town
        mods = ["dental", "physio", "optical"] + list(rng.choice(MODALITIES, k - 3, p=PRACTICE_MIX))
        for mod in mods:
            n += 1
            spread = 12 if c["metro"] else 4
            lat, lon = jitter(c["lat"], c["lon"], spread)
            mult = float(np.exp(rng.normal(0.05 if c["metro"] else -0.03, 0.10)))
            fees = {code: (round(base * mult / 5) * 5 if rng.random() < 0.7 else round(base * mult))
                    for code, base in BASE_FEE.items()}
            # Regional broadband often geolocates to the state capital, not the town.
            if not c["metro"] and rng.random() < 0.25:
                cap = CITY[CAPITAL[c["state"]]]
                ip_geo = (CAPITAL[c["state"]], "AU", *jitter(cap["lat"], cap["lon"], 3))
            else:
                ip_geo = (city, "AU", *jitter(lat, lon, 2))
            p = Practice(f"PR{n:04d}", f"{city} {mod.title()} {n:03d}", mod, city, lat, lon,
                         float(np.exp(rng.normal(0, 0.8))), new_account("practice"), fees, ip_geo)
            n_prac = int(np.clip(round(p.size * 3), 1, 12))
            p.practitioners = [f"PT{n:04d}{j:02d}" for j in range(n_prac)]
            practices.append(p)

    metro = [p for p in practices if CITY[p.city]["metro"]]

    # CONFOUNDER: corporate chains. Dozens of practices, one head-office
    # account. "Distinct practices paying into this account" is enormous and
    # entirely legitimate.
    chains = [("CHAIN-D1", "dental", 25), ("CHAIN-D2", "dental", 15),
              ("CHAIN-O1", "optical", 20), ("CHAIN-P1", "physio", 12)]
    taken = set()
    for gid, mod, k in chains:
        pool = [p for p in metro if p.modality == mod and p.practice_id not in taken]
        acct = new_account("chain")
        for i in rng.choice(len(pool), min(k, len(pool)), replace=False):
            pool[i].account, pool[i].group = acct, gid
            taken.add(pool[i].practice_id)

    # CONFOUNDER: multi-site owners. Two to four practices, often of different
    # types, on one account: squarely inside the bank-ring range.
    for o in range(25):
        city = rng.choice(CITY_NAMES, p=CITY_W)
        pool = [p for p in practices if p.city == city and p.practice_id not in taken]
        if len(pool) < 2:
            continue
        acct = new_account("owner")
        for i in rng.choice(len(pool), min(int(rng.integers(2, 5)), len(pool)), replace=False):
            pool[i].account, pool[i].group = acct, f"OWNER-{o:02d}"
            taken.add(pool[i].practice_id)

    # CONFOUNDER: specialist practices with unusual but legitimate billing
    # (a periodontist bills extended scaling, a sports physio bills long
    # consults). Their profile looks exactly like upcoding at practice level.
    free = [p for p in practices if p.profile == "normal"]
    for mod, k in [("dental", 3), ("physio", 2), ("chiro", 1), ("podiatry", 1), ("optical", 1)]:
        pool = [p for p in free if p.modality == mod and p.profile == "normal"]
        for i in rng.choice(len(pool), k, replace=False):
            pool[i].profile = "specialist"

    # FRAUD (undetected pattern): upcoding practices.
    for mod, k in [("dental", 3), ("physio", 2), ("chiro", 1)]:
        pool = [p for p in practices if p.modality == mod and p.profile == "normal" and p.size > 0.8]
        for i in rng.choice(len(pool), k, replace=False):
            pool[i].profile = "upcoder"
            pool[i].size *= 1.5

    # CONFOUNDER: reception kiosks. A few busy practices hand patients an
    # iPad to lodge their claim on the spot. One device, many unrelated
    # members, minutes apart: a device ring by every surface measure.
    pool = [p for p in metro if p.modality in ("dental", "optical", "physio") and p.size > 1.2]
    for i in rng.choice(len(pool), 5, replace=False):
        pool[i].kiosk = True
        pool[i].size = max(pool[i].size * 6, 10.0)  # big, busy practices
    return practices


# ---------------------------------------------------------------------------
# Build members and households
# ---------------------------------------------------------------------------

def build_memberships() -> list[Membership]:
    memberships = []
    m_n = 0
    for i in range(N_MEMBERSHIPS):
        city = str(rng.choice(CITY_NAMES, p=CITY_W))
        c = CITY[city]
        lat, lon = jitter(c["lat"], c["lon"], 14 if c["metro"] else 4)
        addr = f"{rng.integers(1, 250)} {rng.choice(STREETS)} {rng.choice(STREET_TYPES)}, {city} {c['state']}"
        ms = Membership(f"F{i:05d}", city, lat, lon, addr, new_account("membership"))
        size = int(rng.choice([1, 2, 3, 4, 5], p=[0.38, 0.28, 0.13, 0.14, 0.07]))
        tenure_years = float(np.clip(rng.exponential(6.5), 0, 35))
        join = FY_START - timedelta(days=int(tenure_years * 365))
        # ~12% of memberships join during the year
        if rng.random() < 0.12:
            join = FY_START + timedelta(days=int(rng.integers(0, 300)))
        primary_age = int(rng.integers(22, 86))
        ages_roles = [(primary_age, "primary")]
        if size >= 2:
            if size == 2 and rng.random() < 0.15 and primary_age < 60:
                ages_roles.append((int(rng.integers(0, 18)), "child"))
            else:
                ages_roles.append((int(np.clip(primary_age + rng.integers(-5, 6), 20, 90)), "partner"))
        for _ in range(size - len(ages_roles)):
            if primary_age > 45 and rng.random() < 0.3:
                ages_roles.append((int(rng.integers(18, 25)), "adult_child"))
            else:
                ages_roles.append((int(np.clip(primary_age - rng.integers(22, 40), 0, 17)), "child"))
        for age, role in ages_roles:
            m_n += 1
            mj = join if role != "child" else max(join, FY_START - timedelta(days=int(age * 365)))
            mem = Member(f"M{m_n:06d}", ms, age, mj, role)
            base = {"child": 1.3, "adult": 2.3, "older": 3.0}[mem.age_group]
            mem.rate = base * CLAIM_RATE_SCALE * float(rng.gamma(0.9, 1 / 0.9))
            mem.p_pos = float(rng.beta(3, 2))
            if mem.age >= 18 and rng.random() < 0.25:
                mem.phone_change = rand_day(FY_START, FY_END)
            ms.members.append(mem)
        memberships.append(ms)

    adults = [m for ms in memberships for m in ms.members if m.age >= 18]

    # CONFOUNDER: household shared devices. Families lodge on a shared
    # tablet, and parents always lodge for their children.
    for ms in memberships:
        if len(ms.members) >= 2 and rng.random() < 0.45:
            ms.tablet = True

    # CONFOUNDER: travel. Australians travel a lot, overseas and interstate.
    # Wi-Fi abroad geolocates abroad; roaming mobile data usually comes home
    # through the Australian carrier and geolocates to Sydney or Melbourne.
    for ms in memberships:
        for _ in range(rng.poisson(0.45)):
            start = rand_day(FY_START, FY_END)
            dest = OVERSEAS[rng.choice(len(OVERSEAS), p=OS_TRAVEL_W)]
            ms.trips.append((start, start + timedelta(days=int(rng.integers(7, 36))), "overseas",
                             (dest[0], dest[1], dest[2], dest[3])))
        for _ in range(rng.poisson(0.8)):
            start = rand_day(FY_START, FY_END)
            dest = str(rng.choice(CITY_NAMES, p=CITY_W))
            if dest == ms.city:
                continue
            d = CITY[dest]
            ms.trips.append((start, start + timedelta(days=int(rng.integers(3, 15))), "domestic",
                             (dest, "AU", d["lat"], d["lon"])))

    # CONFOUNDER: movers. Moved interstate, never updated the address.
    for ms in rng.choice(memberships, int(0.02 * N_MEMBERSHIPS), replace=False):
        new_city = str(rng.choice(CITY_NAMES, p=CITY_W))
        if new_city != ms.city:
            ms.move = (rand_day(FY_START, FY_END - timedelta(days=60)), new_city)
            for m in ms.members:
                m.truth.add("mover")

    # CONFOUNDER: FIFO workers, on site two weeks in three.
    fifo_pool = [m for m in adults if m.ms.city in FIFO_HOME_CITIES and 22 <= m.age <= 55]
    for m in rng.choice(fifo_pool, min(int(0.012 * len(adults)), len(fifo_pool)), replace=False):
        m.fifo = (str(rng.choice(list(FIFO_SITES))), int(rng.integers(0, 21)))
        m.truth.add("fifo")

    # CONFOUNDER: VPN users, whose IP says Singapore or Los Angeles.
    for m in rng.choice(adults, int(0.02 * len(adults)), replace=False):
        m.vpn = VPN_EXITS[rng.integers(len(VPN_EXITS))]
        m.truth.add("vpn")

    # CONFOUNDER: carers. An adult child lodges claims for an elderly parent
    # in another membership, sometimes at another address or in another city.
    # Two unrelated memberships, one device.
    olders = [ms for ms in memberships if ms.members[0].age >= 68]
    carers = [m for m in adults if 35 <= m.age <= 62]
    for ms in rng.choice(olders, min(300, len(olders)), replace=False):
        same_city = [m for m in carers if m.ms.city == ms.city and m.ms is not ms]
        pool = same_city if (same_city and rng.random() < 0.8) else carers
        ms.carer = pool[rng.integers(len(pool))]
        ms.carer.truth.add("carer")
        if rng.random() < 0.3:
            ms.payee_override = ms.carer.ms.account

    # CONFOUNDER: extended-family accounts. Young adults on their own
    # membership whose benefits still go to a parent's account.
    young = [ms for ms in memberships if len(ms.members) == 1 and ms.members[0].age <= 28]
    parents = [ms for ms in memberships if ms.members[0].age >= 45]
    for ms in rng.choice(young, min(200, len(young)), replace=False):
        same_city = [p for p in parents if p.city == ms.city]
        pool = same_city if same_city else parents
        ms.payee_override = pool[rng.integers(len(pool))].account
    return memberships


# ---------------------------------------------------------------------------
# Where is someone, and where does their IP say they are?
# ---------------------------------------------------------------------------

def physical_location(m: Member, when: datetime):
    """(city, country, lat, lon, context tag or None) for a member at a time."""
    ms = m.ms
    for start, end, kind, geo in ms.trips:
        if start <= when < end:
            return (*geo, f"travel_{kind}")
    if m.fifo and ((when - FY_START).days - m.fifo[1]) % 21 < 14:
        lat, lon = FIFO_SITES[m.fifo[0]]
        return (m.fifo[0], "AU", lat, lon, "fifo")
    if ms.move and when >= ms.move[0]:
        c = CITY[ms.move[1]]
        return (ms.move[1], "AU", c["lat"], c["lon"], "mover")
    return (ms.city, "AU", ms.lat, ms.lon, None)


def ip_geolocation(m: Member, when: datetime, network: str):
    """Resolve the IP a member submits from, and where geolocation puts it."""
    city, country, lat, lon, tag = physical_location(m, when)
    tags = {tag} if tag else set()
    if m.vpn and rng.random() < 0.7:
        v = m.vpn
        return fake_ip(f"vpn:{v[0]}:{rng.integers(50)}", "fixed"), (v[0], v[1], *jitter(v[2], v[3], 5)), tags | {"vpn"}
    if country != "AU":
        if network == "mobile" and rng.random() < 0.4:  # roaming: comes home via AU carrier
            hub = CITY[str(rng.choice(NATIONAL_HUBS))]
            return (fake_ip(f"mob:{m.member_id}:{when.month}", "mobile"),
                    ("Sydney" if hub["lat"] > -35 else "Melbourne", "AU", *jitter(hub["lat"], hub["lon"], 5)),
                    tags | {"ip_hub"})
        return fake_ip(f"wifi:{m.member_id}:{when.date()}", "fixed"), (city, country, *jitter(lat, lon, 8)), tags
    state = CITY[city]["state"] if city in CITY else ("WA" if lon < 129 else "QLD")
    cap_name = CAPITAL[state]
    if network == "mobile":
        r = rng.random()
        key = fake_ip(f"mob:{m.member_id}:{when.month}:{when.day // 8}", "mobile")
        if r < 0.55:
            cap = CITY[cap_name]
            return key, (cap_name, "AU", *jitter(cap["lat"], cap["lon"], 5)), tags | ({"ip_hub"} if cap_name != city else set())
        if r < 0.70:
            hub_name = str(rng.choice(NATIONAL_HUBS)); hub = CITY[hub_name]
            return key, (hub_name, "AU", *jitter(hub["lat"], hub["lon"], 5)), tags | ({"ip_hub"} if hub_name != city else set())
        return key, (city, "AU", *jitter(lat, lon, 15)), tags
    # fixed broadband
    home_key = m.ms.membership_id if tag != "mover" else f"{m.ms.membership_id}:moved"
    if tag in ("travel_domestic", "fifo"):
        home_key = f"{m.member_id}:{city}:{when.date()}"
    if rng.random() < 0.25 and cap_name != city:
        cap = CITY[cap_name]
        return fake_ip(f"bb:{home_key}", "fixed"), (cap_name, "AU", *jitter(cap["lat"], cap["lon"], 5)), tags | {"ip_hub"}
    return fake_ip(f"bb:{home_key}", "fixed"), (city, "AU", *jitter(lat, lon, 4)), tags


# ---------------------------------------------------------------------------
# Claims
# ---------------------------------------------------------------------------

class ClaimFactory:
    def __init__(self, practices, memberships):
        self.practices = practices
        self.memberships = memberships
        self.by_city_mod: dict = {}
        for p in practices:
            self.by_city_mod.setdefault((p.city, p.modality), []).append(p)
        self.rows: list[dict] = []

    # --- practice choice -------------------------------------------------
    def practices_near(self, city: str, mod: str) -> list[Practice]:
        if (city, mod) in self.by_city_mod:
            return self.by_city_mod[(city, mod)]
        state = CITY[city]["state"] if city in CITY else "WA"
        return self.by_city_mod.get((CAPITAL[state], mod)) or self.by_city_mod[("Sydney", mod)]

    def choose_practice(self, m: Member, city: str, mod: str) -> Practice:
        pool = self.practices_near(city, mod)
        key = (city, mod)
        if key not in m.home_practice:
            w = np.array([p.size for p in pool]); w /= w.sum()
            m.home_practice[key] = pool[rng.choice(len(pool), p=w)]
        if rng.random() < 0.85:
            return m.home_practice[key]
        return pool[rng.integers(len(pool))]

    # --- items and fees ---------------------------------------------------
    @staticmethod
    def items_for(p: Practice, mod: str, variant: str | None = None):
        variant = variant or ("high" if p.profile == "specialist" else "normal")
        items = list(pick(TEMPLATES[mod][variant]))
        upcoded = False
        if p.profile == "upcoder" and rng.random() < 0.30:
            idx = [i for i, it in enumerate(items) if it in UPCODE]
            if idx:
                i = idx[rng.integers(len(idx))]
                items[i] = UPCODE[items[i]]
                upcoded = True
        return items, upcoded

    @staticmethod
    def amount_for(p: Practice, items: list, fabricated: bool = False) -> float:
        total = 0.0
        for it in items:
            fee = p.fees[it]
            if it == "OP201":  # frames vary with the frame chosen
                fee = float(rng.choice([149, 179, 199, 229, 249, 289, 329, 389, 449]))
            if fabricated:  # fake receipts rarely match the practice's price list
                fee = BASE_FEE[it] * rng.uniform(0.95, 1.45)
                fee = round(fee / 5) * 5 if rng.random() < 0.6 else round(fee, 2)
            total += fee
        return round(float(total), 2)

    # --- devices ------------------------------------------------------------
    @staticmethod
    def phone(m: Member, when: datetime) -> str:
        gen = 1 if (m.phone_change and when >= m.phone_change) else 0
        return h(f"phone:{m.member_id}:{gen}")

    def submitter_device(self, m: Member, when: datetime, channel: str):
        """Return (device, person whose location drives the IP, context tags)."""
        ms = m.ms
        tags = set()
        adults = [x for x in ms.members if x.age >= 18]
        if ms.carer and rng.random() < 0.75:
            c = ms.carer
            tags.add("carer_device")
            dev = h(f"desktop:{c.ms.membership_id}") if channel == "web" else self.phone(c, when)
            return dev, c, tags
        if channel == "web":
            return h(f"desktop:{ms.membership_id}"), m, ({"shared_device"} if len(ms.members) > 1 else set())
        if m.age < 18:
            parent = adults[rng.integers(len(adults))] if adults else m
            tags.add("shared_device")
            if ms.tablet and rng.random() < 0.4:
                return h(f"tablet:{ms.membership_id}"), parent, tags
            return self.phone(parent, when), parent, tags
        if ms.tablet and rng.random() < 0.3:
            return h(f"tablet:{ms.membership_id}"), m, {"shared_device"}
        return self.phone(m, when), m, tags

    # --- one claim ---------------------------------------------------------
    def emit(self, m: Member, p: Practice, service_day: datetime, items: list, amount: float,
             channel: str, submitted: datetime, device: str, ip: str, geo: tuple, payee: Account,
             truth: dict, context: set):
        if submitted >= FY_END or service_day < m.join_date:
            return
        practitioner = p.practitioners[rng.integers(len(p.practitioners))]
        self.rows.append(dict(
            member_id=m.member_id, membership_id=m.ms.membership_id, practice_id=p.practice_id,
            practitioner_id=practitioner, claim_type=p.modality, channel=channel,
            service_date=service_day.date(), submitted_at=submitted, item_codes=";".join(items),
            amount=amount, submission_ip=ip, ip_city=geo[0], ip_country=geo[1],
            ip_lat=round(geo[2], 4), ip_lon=round(geo[3], 4), device_fingerprint=device,
            payee_bsb=payee.bsb, payee_account=payee.number,
            _account_id=payee.account_id,
            is_fraud=int(truth.get("is_fraud", 0)), fraud_pattern=truth.get("pattern", "none"),
            device_ring_id=truth.get("device_ring", ""), bank_ring_id=truth.get("bank_ring", ""),
            distance_case_id=truth.get("distance_case", ""),
            legit_context=";".join(sorted(context)) if not truth.get("is_fraud") else "",
        ))

    def legit_claim(self, m: Member, service_day: datetime, mod: str, practice: Practice | None = None,
                    channel: str | None = None, submitted: datetime | None = None,
                    device_info=None, extra_context: set | None = None):
        loc = physical_location(m, at_time(service_day, 12))
        p = practice or self.choose_practice(m, loc[0] if loc[1] == "AU" else m.ms.city, mod)
        items, upcoded = self.items_for(p, mod)
        amount = self.amount_for(p, items)
        context = set(extra_context or ())
        if p.profile == "specialist":
            context.add("specialist_practice")
        if loc[4] == "travel_domestic":
            context.add("treated_while_travelling")
        if channel is None:
            r = rng.random()
            if p.kiosk:
                channel = "point_of_sale" if r < 0.30 else ("kiosk" if r < 0.85 else "app")
            else:
                channel = "point_of_sale" if r < m.p_pos else ("app" if r < m.p_pos + (1 - m.p_pos) * 0.85 else "web")
        if channel in ("point_of_sale", "kiosk"):
            submitted = submitted or at_time(service_day, appointment_hour())
            if channel == "kiosk":
                device = h(f"kiosk:{p.practice_id}")
                context.add("kiosk")
                payee = m.ms.payee_override or m.ms.account
            else:
                device = h(f"terminal:{p.practice_id}")
                payee = p.account
                if p.group.startswith("CHAIN"):
                    context.add("corporate_account")
                elif p.group.startswith("OWNER"):
                    context.add("multi_site_account")
            ip, geo = fake_ip(f"practice:{p.practice_id}", "fixed"), p.ip_geo
            if p.ip_geo[0] != p.city:
                context.add("ip_hub")
        else:
            if submitted is None:
                lag = 0 if rng.random() < 0.35 else int(min(rng.exponential(6), 120))
                submitted = at_time(service_day + timedelta(days=lag), evening_hour())
            if device_info is None:
                device_info = self.submitter_device(m, submitted, channel)
            device, who, dtags = device_info
            context |= dtags
            network = "fixed" if channel == "web" else ("mobile" if rng.random() < 0.55 else "fixed")
            ip, geo, gtags = ip_geolocation(who, submitted, network)
            context |= gtags
            payee = m.ms.payee_override or m.ms.account
            if m.ms.payee_override:
                context.add("extended_family_account")
        truth = {"is_fraud": 1, "pattern": "upcoding"} if upcoded else {}
        self.emit(m, p, service_day, items, amount, channel, submitted, device, ip, geo, payee, truth, context)

    # --- legitimate activity ----------------------------------------------
    def legit_activity(self):
        for ms in self.memberships:
            for m in ms.members:
                earliest = max(FY_START, m.join_date + timedelta(days=60))  # waiting period
                if earliest >= FY_END - timedelta(days=2):
                    continue
                frac = (FY_END - earliest).days / FY_DAYS
                for _ in range(rng.poisson(m.rate * frac)):
                    day = rand_day(earliest, FY_END)
                    # Nobody sees an Australian dentist while in Bali.
                    for start, end, kind, _ in ms.trips:
                        if kind == "overseas" and start <= day < end:
                            day = fiscal_clip(start - timedelta(days=int(rng.integers(1, 12))))
                    mod = MODALITIES[rng.choice(7, p=MODALITY_BY_AGE[m.age_group])]
                    self.legit_claim(m, day, mod)
            self.family_batches(ms)

    def family_batches(self, ms: Membership):
        """CONFOUNDER: families claiming for each other. The whole family sees
        the dentist on one afternoon and a parent lodges every claim from one
        phone within a minute or two: several members, one device, one burst."""
        kids = [m for m in ms.members if m.age < 18]
        adults = [m for m in ms.members if m.age >= 18]
        if not kids or not adults:
            return
        for _ in range(rng.poisson(1.1)):
            parent = adults[rng.integers(len(adults))]
            group = kids + ([parent] if rng.random() < 0.6 else [])
            earliest = max(FY_START, max(x.join_date for x in group) + timedelta(days=60))
            if earliest >= FY_END - timedelta(days=2):
                continue
            day = rand_day(earliest, FY_END)
            loc = physical_location(parent, at_time(day, 12))
            if loc[1] != "AU":
                continue
            p = self.choose_practice(parent, loc[0], "dental")
            r = rng.random()
            channel = "point_of_sale" if r < parent.p_pos else "app"
            lag = 0 if rng.random() < 0.5 else int(rng.integers(1, 10))
            base_t = at_time(day + timedelta(days=lag), evening_hour() if channel == "app" else appointment_hour())
            if ms.tablet and rng.random() < 0.4:
                dev = (h(f"tablet:{ms.membership_id}"), parent, {"shared_device"})
            else:
                dev = (self.phone(parent, base_t), parent, {"shared_device"})
            for j, x in enumerate(group):
                t = base_t + timedelta(seconds=int(40 * j + rng.integers(0, 40)))
                self.legit_claim(x, day, "dental", practice=p, channel=channel, submitted=t,
                                 device_info=dev, extra_context={"family_batch"})

    # --- fraud ------------------------------------------------------------
    def fraud_claim(self, m: Member, p: Practice, service_day: datetime, submitted: datetime,
                    device: str, ip: str, geo: tuple, payee: Account, truth: dict,
                    variant: str = "high", channel: str | None = None):
        items, _ = self.items_for(Practice(**{**p.__dict__, "profile": "normal"}), p.modality, variant)
        amount = self.amount_for(p, items, fabricated=rng.random() < 0.6)
        channel = channel or ("app" if rng.random() < 0.85 else "web")
        self.emit(m, p, service_day, items, amount, channel, submitted, device, ip, geo, payee,
                  {"is_fraud": 1, **truth}, set())


def build_fraud(f: ClaimFactory, memberships: list[Membership]):
    all_members = [m for ms in memberships for m in ms.members]
    mule_pool: dict[str, list[Member]] = {}
    used: set[str] = set()
    synth_n = [0]

    def new_synthetic(city: str, start: datetime) -> Member:
        """A member recruited or invented for the ring: recent join, single cover."""
        synth_n[0] += 1
        c = CITY[city]
        lat, lon = jitter(c["lat"], c["lon"], 14)
        addr = f"{rng.integers(1, 250)} {rng.choice(STREETS)} {rng.choice(STREET_TYPES)}, {city} {c['state']}"
        ms = Membership(f"F9{synth_n[0]:04d}", city, lat, lon, addr, new_account("membership"))
        m = Member(f"M9{synth_n[0]:05d}", ms, int(rng.integers(19, 45)),
                   start - timedelta(days=int(rng.integers(70, 330))), "primary", synthetic=True)
        ms.members.append(m)
        memberships.append(ms)
        return m

    def pick_mules(city: str, k: int, start: datetime) -> list[Member]:
        chosen, seen_ms = [], set()
        prior = [m for m in mule_pool.get(city, [])]
        for _ in range(k):
            r = rng.random()
            if r < 0.2 and prior:  # reused from an earlier ring
                m = prior.pop(rng.integers(len(prior)))
            elif r < 0.5:
                m = new_synthetic(city, start)
            else:
                cands = [x for x in all_members if x.ms.city == city and 19 <= x.age <= 50
                         and x.join_date < start - timedelta(days=60) and x.member_id not in used]
                m = cands[rng.integers(len(cands))]
            if m.ms.membership_id in seen_ms:
                continue  # rings recruit unrelated people
            seen_ms.add(m.ms.membership_id)
            used.add(m.member_id)
            m.truth.add("mule")
            chosen.append(m)
        mule_pool.setdefault(city, []).extend(chosen)
        return chosen

    def ring_network(key: str, city: str):
        c = CITY[city]
        if rng.random() < 0.5:
            return fake_ip(f"ring:{key}", "fixed"), (city, "AU", *jitter(c["lat"], c["lon"], 10))
        cap = CITY[CAPITAL[c["state"]]]
        return fake_ip(f"ringmob:{key}", "mobile"), (CAPITAL[c["state"]], "AU", *jitter(cap["lat"], cap["lon"], 5))

    def random_practice(city: str, mod: str) -> Practice:
        pool = f.practices_near(city, mod)
        return pool[rng.integers(len(pool))]

    fraud_mods = [m for m, w in zip(MODALITIES, FRAUD_MODALITY) if w > 0]
    fraud_w = np.array([w for w in FRAUD_MODALITY if w > 0]); fraud_w /= fraud_w.sum()

    # FRAUD: device rings. One phone, three to seven unrelated members,
    # everything lodged inside a few hours to two and a half days.
    for r in range(24):
        city = str(rng.choice(RING_CITIES, p=RING_CITY_W))
        start = at_time(rand_day(FY_START + timedelta(days=20), FY_END - timedelta(days=4)), float(rng.uniform(0, 24)))
        window_h = float(rng.uniform(4, 60))
        mules = pick_mules(city, int(rng.integers(3, 8)), start)
        device = h(f"ringdevice:{r}")
        ring_acct = new_account("ring") if rng.random() < 0.45 else None
        truth = {"pattern": "device_ring", "device_ring": f"DR{r:02d}"}
        if ring_acct:
            truth["bank_ring"] = f"BR-D{r:02d}"
        for m in mules:
            for _ in range(1 if rng.random() < 0.7 else 2):
                t = start + timedelta(hours=float(rng.uniform(0, window_h)))
                ip, geo = ring_network(f"d{r}:{t.date()}", city)
                p = random_practice(city, fraud_mods[rng.choice(len(fraud_mods), p=fraud_w)])
                svc = fiscal_clip(t - timedelta(days=int(rng.integers(0, 15))))
                f.fraud_claim(m, p, svc, t, device, ip, geo, ring_acct or m.ms.account, truth)

    # FRAUD: bank rings. Several unrelated members, each on their own phone,
    # claiming at a spread of unrelated practices over two to five weeks,
    # every benefit paid into one account.
    for r in range(16):
        city = str(rng.choice(RING_CITIES, p=RING_CITY_W))
        start = at_time(rand_day(FY_START + timedelta(days=10), FY_END - timedelta(days=20)), 9)
        window_d = float(rng.uniform(10, 35))
        mules = pick_mules(city, int(rng.integers(3, 7)), start)
        acct = new_account("ring")
        shared_device = h(f"bankringdevice:{r}") if rng.random() < 0.25 else None
        truth = {"pattern": "bank_ring", "bank_ring": f"BR{r:02d}"}
        if shared_device:
            truth["device_ring"] = f"DR-B{r:02d}"
        pool = [p for mod in fraud_mods for p in f.practices_near(city, mod)]
        for m in mules:
            for _ in range(int(rng.choice([1, 2, 3], p=[0.4, 0.35, 0.25]))):
                t = start + timedelta(days=float(rng.uniform(0, window_d)))
                t = at_time(t, evening_hour())
                device = shared_device or f.phone(m, t)
                ip, geo, _ = ip_geolocation(m, t, "mobile" if rng.random() < 0.55 else "fixed")
                p = pool[rng.integers(len(pool))]
                svc = fiscal_clip(t - timedelta(days=int(rng.integers(0, 12))))
                f.fraud_claim(m, p, svc, t, device, ip, geo, acct, truth)

    # FRAUD: distance, as account takeover. A fraudster logs in as an
    # established member, lodges fake receipts from plausible local practices
    # and redirects payment. Some fraudsters sit overseas, some interstate,
    # and some route through Australian mobile or VPN and look local.
    fraudsters = []
    for k in range(25):
        r = rng.random()
        if r < 0.45:
            o = OVERSEAS[rng.choice(len(OVERSEAS), p=OS_FRAUD_W)]
            loc = ("overseas", (o[0], o[1], o[2], o[3]))
        elif r < 0.80:
            cname = str(rng.choice(CITY_NAMES, p=CITY_W)); c = CITY[cname]
            loc = ("interstate", (cname, "AU", c["lat"], c["lon"]))
        else:
            hub = str(rng.choice(NATIONAL_HUBS)); c = CITY[hub]
            loc = ("local_looking", (hub, "AU", c["lat"], c["lon"]))
        fraudsters.append(dict(id=k, loc=loc, device=h(f"fraudster:{k}"), account=new_account("fraudster")))
    established = [m for m in all_members if m.age >= 25 and m.join_date < FY_START - timedelta(days=365)
                   and m.member_id not in used and not m.ms.carer]
    for v, m in enumerate(rng.choice(established, 40, replace=False)):
        fr = fraudsters[rng.integers(len(fraudsters))]
        kind, geo0 = fr["loc"]
        if kind == "local_looking":  # an Australian mobile or VPN in the victim's own state
            cap = CAPITAL[CITY[m.ms.city]["state"]]
            geo0 = (cap, "AU", CITY[cap]["lat"], CITY[cap]["lon"])
        if kind == "interstate" and geo0[0] == m.ms.city:
            geo0 = ("Perth", "AU", CITY["Perth"]["lat"], CITY["Perth"]["lon"]) if m.ms.city != "Perth" else ("Sydney", "AU", -33.87, 151.21)
        m.truth.add("takeover_victim")
        start = at_time(rand_day(FY_START + timedelta(days=5), FY_END - timedelta(days=6)), 0)
        for _ in range(int(rng.choice([1, 2, 3], p=[0.3, 0.4, 0.3]))):
            t = start + timedelta(hours=float(rng.uniform(0, 120)))
            geo = (geo0[0], geo0[1], *jitter(geo0[2], geo0[3], 8))
            ip = fake_ip(f"fraudster:{fr['id']}:{t.date()}", "mobile" if kind == "local_looking" else "fixed")
            p = random_practice(m.ms.city, fraud_mods[rng.choice(len(fraud_mods), p=fraud_w)])
            svc = fiscal_clip(t - timedelta(days=int(rng.integers(1, 20))))
            f.fraud_claim(m, p, svc, t, fr["device"], ip, geo, fr["account"],
                          {"pattern": "distance", "distance_case": f"ATO{v:02d}"})

    # FRAUD: distance, member-lodged while away. A member overseas lodges
    # claims for home-practice services dated while they were out of the
    # country. Wi-Fi puts them abroad; roaming data can make them look home.
    travellers = [m for ms in memberships for m in ms.members if m.age >= 20
                  and any(t[2] == "overseas" and (t[1] - t[0]).days >= 10 for t in ms.trips)
                  and m.member_id not in used and not m.synthetic]
    for v, m in enumerate(rng.choice(travellers, 25, replace=False)):
        trip = [t for t in m.ms.trips if t[2] == "overseas" and (t[1] - t[0]).days >= 10][0]
        m.truth.add("away_claimant")
        for _ in range(int(rng.choice([1, 2, 3], p=[0.35, 0.4, 0.25]))):
            t = at_time(trip[0] + timedelta(days=float(rng.uniform(3, (trip[1] - trip[0]).days))), evening_hour())
            if t >= FY_END:
                continue
            svc = fiscal_clip(t - timedelta(days=int(rng.integers(0, 3))))
            mod = fraud_mods[rng.choice(len(fraud_mods), p=fraud_w)]
            p = f.choose_practice(m, m.ms.city, mod)
            ip, geo, _ = ip_geolocation(m, t, "mobile" if rng.random() < 0.5 else "fixed")
            f.fraud_claim(m, p, svc, t, f.phone(m, t), ip, geo, m.ms.payee_override or m.ms.account,
                          {"pattern": "distance", "distance_case": f"AWAY{v:02d}"}, variant="normal")


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

def main():
    DATA.mkdir(exist_ok=True)
    practices = build_practices()
    memberships = build_memberships()
    f = ClaimFactory(practices, memberships)
    f.legit_activity()
    build_fraud(f, memberships)

    claims = pd.DataFrame(f.rows).sort_values("submitted_at", kind="stable").reset_index(drop=True)
    claims.insert(0, "claim_id", [f"C{i:07d}" for i in range(1, len(claims) + 1)])
    claims["submitted_at"] = claims["submitted_at"].dt.strftime("%Y-%m-%d %H:%M:%S")

    observable = ["claim_id", "member_id", "membership_id", "practice_id", "practitioner_id",
                  "claim_type", "channel", "service_date", "submitted_at", "item_codes", "amount",
                  "submission_ip", "ip_city", "ip_country", "ip_lat", "ip_lon",
                  "device_fingerprint", "payee_bsb", "payee_account"]
    truth = ["claim_id", "is_fraud", "fraud_pattern", "device_ring_id", "bank_ring_id",
             "distance_case_id", "legit_context"]
    claims[observable].to_csv(DATA / "claims.csv", index=False)
    claims[truth].to_csv(DATA / "claims_truth.csv", index=False)

    members = [m for ms in memberships for m in ms.members]
    pd.DataFrame([dict(member_id=m.member_id, membership_id=m.ms.membership_id, role=m.role,
                       age=m.age, join_date=m.join_date.date(), address=m.ms.address,
                       city=m.ms.city, state=CITY[m.ms.city]["state"],
                       home_lat=round(m.ms.lat, 4), home_lon=round(m.ms.lon, 4)) for m in members]
                 ).to_csv(DATA / "members.csv", index=False)
    pd.DataFrame([dict(member_id=m.member_id, synthetic_identity=int(m.synthetic),
                       tags=";".join(sorted(m.truth))) for m in members]
                 ).to_csv(DATA / "members_truth.csv", index=False)
    pd.DataFrame([dict(practice_id=p.practice_id, name=p.name, practice_type=p.modality, city=p.city,
                       state=CITY[p.city]["state"], lat=round(p.lat, 4), lon=round(p.lon, 4),
                       payee_bsb=p.account.bsb, payee_account=p.account.number) for p in practices]
                 ).to_csv(DATA / "practices.csv", index=False)
    pd.DataFrame([dict(practice_id=p.practice_id, profile=p.profile, kiosk=int(p.kiosk), group=p.group)
                  for p in practices]).to_csv(DATA / "practices_truth.csv", index=False)
    pd.DataFrame([dict(practitioner_id=pt, practice_id=p.practice_id, profession=p.modality,
                       provider_number=f"PRV-{h(pt, 6).upper()}") for p in practices for pt in p.practitioners]
                 ).to_csv(DATA / "practitioners.csv", index=False)

    n, fr = len(claims), claims.is_fraud.sum()
    print(f"claims: {n:,}   fraud: {fr:,} ({fr / n:.2%})")
    print(claims.fraud_pattern.value_counts().to_string())


if __name__ == "__main__":
    main()
