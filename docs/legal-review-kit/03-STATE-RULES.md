# Current State Rules Configuration
## What Our System Uses to Generate Waivers

This is a human-readable version of our state rules configuration file (`lib/waivers/state-rules.ts`). This is the source of truth for how ObraKit decides which waiver types are available, what fields are required, and what statutory language to include.

---

## California (CA)
- **Statutory Form:** YES (mandatory)
- **Statute:** Cal. Civ. Code SS 8132-8138
- **Available Waiver Types:** All 4
- **Notarization:** No
- **Required Fields:** claimant_name, customer_name, job_location, owner_name, through_date, amount, check_maker, exceptions
- **NOTICE Text:** Embedded in template (see file 04)
- **PDF Template:** Dedicated California template (`california-waiver.tsx`)

## Georgia (GA)
- **Statutory Form:** YES (mandatory)
- **Statute:** O.C.G.A. S 44-14-366
- **Available Waiver Types:** 2 only (Interim/Progress + Final)
- **Notarization:** No
- **Required Fields:** claimant_name, customer_name, job_location, owner_name, through_date, amount
- **NOTICE Text:** Embedded in template (see file 05)
- **PDF Template:** Dedicated Georgia template (`georgia-waiver.tsx`)
- **Special:** 12pt minimum font, 90-day auto-conversion rule

## Texas (TX)
- **Statutory Form:** NO (per our classification)
- **Statute:** Tex. Prop. Code SS 53.281-53.286
- **Available Waiver Types:** All 4
- **Notarization:** No (eliminated by HB 2237 for projects after Jan 1, 2022)
- **Required Fields:** claimant_name, customer_name, job_location, owner_name, through_date, amount
- **NOTICE Text:** None (no statutory requirement)
- **PDF Template:** Generic template
- **QUESTION:** Should TX have statutory forms? Some sources disagree.

## Florida (FL)
- **Statutory Form:** NO (per our current config) -- **OUTDATED, MUST UPDATE**
- **Statute:** Fla. Stat. SS 713.01-713.37 (+ SB 658 effective July 2025)
- **Available Waiver Types:** All 4
- **Notarization:** No
- **Required Fields:** claimant_name, customer_name, job_location, owner_name, through_date, amount
- **NOTICE Text:** None currently -- **MUST ADD**
- **PDF Template:** Generic template -- **MUST CREATE DEDICATED TEMPLATE**
- **CRITICAL:** SB 658 changed FL to require IDENTICAL statutory forms as of July 2025

## New York (NY)
- **Statutory Form:** No
- **Statute:** N.Y. Lien Law SS 3-39-a
- **Available Waiver Types:** All 4
- **Notarization:** No
- **Required Fields:** claimant_name, customer_name, job_location, owner_name, through_date, amount
- **NOTICE Text:** None
- **PDF Template:** Generic template

---

## States NOT YET Configured (from the 12 statutory states)

| State | Needs Config | Needs Template | Needs Statutory Language |
|-------|-------------|---------------|------------------------|
| Arizona (AZ) | YES | YES | YES |
| Massachusetts (MA) | YES | MAYBE | YES |
| Michigan (MI) | YES | YES | YES |
| Mississippi (MS) | YES | YES | YES + notary block |
| Missouri (MO) | YES | YES (residential only) | YES |
| Nevada (NV) | YES | YES | YES |
| Utah (UT) | YES | YES | YES |
| Wyoming (WY) | YES | YES | YES + notary block |

---

## How the System Routes Templates

```
State = CA  -->  CaliforniaWaiver component (dedicated)
State = GA  -->  GeorgiaWaiver component (dedicated)
State = *   -->  GenericWaiver component (fallback)
```

After legal review, we will add dedicated components for: FL, AZ, MI, MS, MO, NV, UT, WY (and possibly MA).
