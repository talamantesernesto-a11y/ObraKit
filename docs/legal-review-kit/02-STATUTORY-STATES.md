# The 12 States with Mandatory Statutory Lien Waiver Forms

These states REQUIRE that lien waivers use specific statutory language. A waiver that doesn't "substantially conform" to the statutory form is void and unenforceable.

---

## Currently Implemented in ObraKit

| State | Statute | Has Custom Template? | Status |
|-------|---------|---------------------|--------|
| **California** | Cal. Civ. Code SS 8132-8138 | YES (dedicated template) | NEEDS REVIEW |
| **Georgia** | O.C.G.A. S 44-14-366 | YES (dedicated template) | NEEDS REVIEW |
| **Texas** | Tex. Prop. Code SS 53.281-53.286 | NO (uses generic) | NEEDS REVIEW |
| **Florida** | Fla. Stat. SS 713.01-713.37 + SB 658 | NO (uses generic) | CRITICAL - needs statutory template per SB 658 |

## Not Yet Implemented (Need to Add)

| State | Statute | Notarization? | Key Notes |
|-------|---------|---------------|-----------|
| **Arizona** | AZ Rev Stat S 33-1008 | No | Mandatory 4 statutory forms. Invalid if modified. |
| **Massachusetts** | MA Gen L ch 254 S 32 | No | Only partial waiver for GCs is statutory. Other waivers unregulated. |
| **Michigan** | MI Comp L S 570.1115 | No | Pre-work lien waivers prohibited. All waivers only effective upon payment. |
| **Mississippi** | MS Code S 85-7-433 | **YES** | Requires notarization. Must use statutory form. |
| **Missouri** | MO Rev Stat S 429.016 | No | Statutory form required ONLY for residential projects. |
| **Nevada** | NV Rev Stat S 108.2457 | No | Mandatory statutory forms. |
| **Utah** | UT Code S 38-1a-802 | No | Mandatory statutory forms. |
| **Wyoming** | WY Stat S 29-10-101 | **YES** | Requires notarization. |

## Also In ObraKit (Non-Statutory)

| State | Statute | Template | Status |
|-------|---------|----------|--------|
| **New York** | N.Y. Lien Law SS 3-39-a | Generic | NEEDS REVIEW |

---

## Key Legal Questions

1. **California:** Is our NOTICE text an exact match to Civil Code SS 8132-8138? Our template uses the notice text verbatim, but we need confirmation it hasn't been amended.

2. **Georgia:** We only support 2 of the 4 types (Interim + Final). Georgia's statute (O.C.G.A. S 44-14-366) defines specific forms. Are we missing any required types?

3. **Texas:** We marked TX as "no statutory form" based on Tex. Prop. Code SS 53.281-53.286. However, Levelset lists TX as one of the 12 statutory states. Does TX require specific form language post-HB 2237?

4. **Florida (CRITICAL):** SB 658 (effective July 1, 2025) changed Florida from "substantially similar" to "identical" to statutory forms in Fla. Stat. S 713.20(4) and (5). We need the exact statutory text to build a Florida-specific template.

5. **Mississippi & Wyoming:** Both require notarization. Can we add a "This waiver requires notarization to be valid" notice on the PDF, or does that create additional liability?

6. **Missouri:** Statutory form is only required for residential projects. Should we ask users to identify project type (residential vs. commercial) and only enforce statutory form for residential?
