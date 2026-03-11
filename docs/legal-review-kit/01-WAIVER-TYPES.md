# Waiver Types Supported by ObraKit

ObraKit generates 4 types of lien waivers, which are standard across the construction industry:

---

## 1. Conditional Waiver and Release on Progress Payment
- **Internal ID:** `conditional_progress`
- **Risk Level:** LOW
- **When Used:** Subcontractor is requesting a progress (partial) payment and has NOT yet received it
- **Legal Effect:** Lien rights are waived ONLY IF and WHEN payment clears
- **Key Protection:** If payment bounces or never arrives, subcontractor retains all lien rights

## 2. Unconditional Waiver and Release on Progress Payment
- **Internal ID:** `unconditional_progress`
- **Risk Level:** MEDIUM
- **When Used:** Subcontractor has ALREADY received and deposited a progress payment
- **Legal Effect:** Takes effect IMMEDIATELY upon signing, even if check hasn't cleared
- **Key Risk:** Rights are waived regardless of whether payment ultimately clears

## 3. Conditional Waiver and Release on Final Payment
- **Internal ID:** `conditional_final`
- **Risk Level:** LOW
- **When Used:** Subcontractor is requesting final payment and has NOT yet received it
- **Legal Effect:** Lien rights are waived ONLY IF and WHEN final payment clears
- **Key Protection:** If final payment never arrives, subcontractor retains all lien rights

## 4. Unconditional Waiver and Release on Final Payment
- **Internal ID:** `unconditional_final`
- **Risk Level:** HIGH
- **When Used:** Subcontractor has received COMPLETE final payment
- **Legal Effect:** Permanently waives ALL lien rights on the project. Irreversible.
- **Key Risk:** No going back. If any amount is still owed, subcontractor loses all recourse.

---

## User Warnings (Displayed in Spanish and English)

ObraKit displays risk warnings to users before they select a waiver type. The unconditional final waiver shows a prominent HIGH RISK warning in both languages.

**Question for Counsel:** Are our risk descriptions legally accurate? Should we add any additional warnings?
