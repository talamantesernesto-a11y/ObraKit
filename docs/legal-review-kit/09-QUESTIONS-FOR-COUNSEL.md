# Specific Legal Questions for Counsel

---

## A. Liability & Risk

### A1. Document Generator Liability
ObraKit generates lien waiver documents based on user input. If a generated waiver is defective (wrong language, missing field, non-compliant with state statute) and a subcontractor loses their lien rights as a result, what is our exposure?

- Can the subcontractor sue ObraKit for damages?
- Can the GC who relied on a defective waiver sue ObraKit?
- Does the fact that we are a technology platform (not a law firm) provide any protection?

### A2. Unauthorized Practice of Law (UPL)
Could generating state-specific legal documents be considered the unauthorized practice of law? How do platforms like LegalZoom, Rocket Lawyer, and Levelset handle this?

### A3. AI Validation Disclaimer
ObraKit uses an AI model (Claude) to validate waiver details before generation (e.g., flagging if the amount exceeds the contract value, warning about unconditional waivers for large amounts). Should we:
- Add a disclaimer that AI validation is not legal advice?
- Remove AI validation to reduce liability?
- Keep it but with specific disclaimer language?

### A4. Signature Validity
Users draw their signature on a phone screen (canvas-based). Is an electronic signature on a lien waiver legally valid in all 50 states? Are there states that require wet signatures or specific e-signature standards?

---

## B. Terms of Service

### B1. Required Disclaimers
What specific disclaimers should our Terms of Service include? At minimum we plan to state:
- ObraKit is a document generation tool, not a legal service
- Users are responsible for verifying documents comply with their state laws
- ObraKit does not provide legal advice
- Use of ObraKit does not create an attorney-client relationship

Is this sufficient? What else should we add?

### B2. Limitation of Liability
What limitation of liability language is appropriate and enforceable for a document generation platform?

### B3. Indemnification
Should we require users to indemnify ObraKit against claims arising from their use of generated documents?

---

## C. State-Specific Questions

### C1. Florida SB 658 Compliance
See file `08-FLORIDA-UPDATE.md` for detailed questions about the new "identical" form requirement.

### C2. Texas Classification
Some sources classify Texas as a "statutory form" state, others don't. Post-HB 2237 (2022), what are the actual requirements for Texas lien waiver forms?

### C3. Notarization States
Mississippi and Wyoming require notarization. Can ObraKit:
- Generate the document without a notary block and add a warning?
- Add a notary block to the template for users to complete offline?
- Refuse to generate for these states until notarization is confirmed?

### C4. Massachusetts Scope
MA's statutory form (MGL ch 254 S 32) appears to only apply to GC partial waivers. Since ObraKit serves subcontractors (not GCs), do we need to implement this specific form?

---

## D. Insurance

### D1. E&O Insurance
Do you recommend Errors & Omissions (Professional Liability) insurance for ObraKit? If so:
- What coverage amount?
- Any specific policy types for document generation platforms?
- Approximate cost range for a pre-revenue startup?

---

## Priority Order

1. **A1** (Liability exposure) - need this to assess overall risk
2. **C1** (Florida compliance) - we are generating non-compliant docs NOW
3. **B1** (ToS disclaimers) - needed before public launch
4. **A2** (UPL risk) - fundamental business model question
5. **A4** (E-signature validity) - affects core functionality
6. Everything else
