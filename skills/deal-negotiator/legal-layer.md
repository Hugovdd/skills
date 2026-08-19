# Legal Layer — Tiered Red Flags + Research Escalation

This file is the issue-spotter and escalation guardrail. The goal is to (a) catch legal exposure before the user signs/sends something they'll regret, (b) translate "what would a lawyer flag?" into plain-language warnings, and (c) escalate to actual web research on current law when the stakes warrant it.

**You are not a lawyer.** Never give legal advice as such. Always frame issues as "this is a lawyer question" and identify the specific question to ask. If the user doesn't have a lawyer for the relevant domain/jurisdiction, your job includes telling them that they need one.

---

## Tiered escalation matrix

```
TIER 0 — Red Flags Only (default)
   • Surface known issue patterns
   • Plain-language explanation of risk
   • Name what to ask a lawyer
   • No web research

TIER 1 — Web Research Triggered
   • Auto-trigger when ANY of:
     - Deal value ≥ $250K
     - Cross-border element (for example, Indonesia, which has strict foreign-ownership rules)
     - Securities / equity / convertible instrument
     - IP assignment or major IP licensing
     - Employment / non-compete / non-solicit
     - Real estate transaction outside US
     - Litigation threatened or mentioned
     - Regulated industry (healthcare, finance, alcohol, cannabis, gambling, government)
   • Use WebSearch + WebFetch to pull:
     - Recent case law in relevant jurisdiction
     - Statutory framework
     - Common bad-faith patterns / known scams in this domain
     - Industry-standard clause language
   • Output: enhanced red flags + named risks + named lawyer questions

TIER 2 — Counsel Required (do not proceed)
   • Auto-trigger when ANY of:
     - Active litigation
     - Securities fraud / criminal exposure
     - Tax structuring across multiple jurisdictions
     - Regulatory enforcement action
     - Anything where being wrong = criminal liability or loss of license
   • Output: hard stop. Tell the user to engage counsel BEFORE replying.
   • Do not draft anything substantive — only an interim message buying time.
```

When triggering Tier 1 or Tier 2, name the trigger explicitly: "This deal trips the Tier 1 threshold because [specific reason] — I'm pulling current law on [topic]."

---

## Red Flag Catalog by Domain

### Real Estate

**Pre-closing**
- Unclear title / chain of ownership
- Cross-border / foreign ownership restrictions (Indonesia: see below)
- Liens, encumbrances, easements not disclosed
- Survey discrepancies, lot-line disputes
- Zoning compliance unclear or pending change
- Environmental liability (especially commercial)
- Pending litigation against the property or owner

**Contract clauses to scrutinize**
- "As-is" without inspection right
- Earnest money forfeit conditions (asymmetric? excessive?)
- Closing-cost allocation language (in a live closing, this is the contract clause to find)
- Buyer / seller default cure periods
- Force majeure scope (overly broad seller-side?)
- Closing date and what happens if it slips
- Possession date vs. closing date (some deals split these)
- Representations and warranties survival post-close

**Handover / closing**
- Possession condition (clean? functional? as-shown vs. as-promised?)
- Repairs and credits agreed in writing vs. promised verbally
- Utilities, deposits, key transfer
- Closing statement reconciliation — every line should be traceable

**Cross-border example: Indonesia (foreign real estate ownership)**
- Foreigners cannot hold freehold (Hak Milik) land in Indonesia. Common structures:
  - Hak Pakai (right of use) — limited duration
  - Hak Guna Bangunan (right to build) — for PT PMA / corporate
  - Leasehold (Sewa) — common for villas, 25-30 yr typical
  - **Nominee structures** (foreigner holds via Indonesian nominee) — **HIGH risk; technically not enforceable; subject to seizure if challenged**. Used widely but a known landmine.
- PT PMA structure: minimum capital requirements, government approval, ongoing reporting obligations
- Notaris (PPAT) must witness all land transfers — informal handshake deals have no enforceability
- Land certificates (Sertipikat) vs. Girik (uncertified ownership claim) — Girik is much higher risk
- Zoning (RTRW) varies dramatically by region; check before buying
- BPN (National Land Agency) records — verify before close
- Local "adat" (customary) rights can override formal title in some areas

**When this is Tier 1+:** Any cross-border RE deal involving foreign ownership structures, nominees, or amounts above ~$100K equiv. Always.

### Equity / Securities

**Term sheet / cap table red flags**
- Liquidation preference > 1x (especially 2x+ participating)
- Participation: full participation vs. capped vs. non-participating (huge difference)
- Anti-dilution: full ratchet (toxic) vs. weighted-average (more reasonable) vs. broad-based weighted average (most founder-friendly)
- Pro-rata rights (good for investor; consider scope)
- Pay-to-play (good for company; toxic to non-participating investors)
- Drag-along rights (necessary, but scope matters)
- Tag-along rights (founder protection — push for these if minority)
- Vesting: cliff length, total vesting period, acceleration triggers (single-trigger vs double-trigger)
- Founder reverse vesting on existing shares
- Information rights vs. inspection rights (intrusive disclosure can hurt later raises)
- Right of first refusal (ROFR) on founder transfers
- No-shop / exclusivity period (cuts off your optionality during negotiation)
- Most-favored-nation (MFN) clauses
- Founder removal provisions, especially for cause vs. without cause
- Board composition and voting thresholds for major decisions
- Protective provisions — what requires investor consent?

**Securities law issues**
- Reg D (US) compliance — accredited investor requirements, filing deadlines
- Number of investors (limits before triggering broader disclosure)
- General solicitation rules (Reg D 506(b) vs 506(c))
- State (US) blue sky compliance
- Crowdfunding (Reg CF) specific rules
- International — JOBS Act safe harbors, foreign investor rules
- Indonesia: BKPM approval, foreign investment reporting if PT PMA
- Convertible notes vs SAFE — discount, valuation cap, conversion mechanics

**When this is Tier 1+:** Any equity or convertible deal. Always.

### Contract / Commercial

**Standard "vendor-favorable" clauses to flip when you're the customer**
- Unlimited indemnity from customer to vendor — flip to capped / mutual
- One-way IP assignments — should be mutual / scoped
- Auto-renewal with short opt-out windows — extend opt-out or remove auto-renewal
- Liability caps too low — push for fees-paid floor at minimum
- "Sole and exclusive remedy" clauses limiting your recourse
- Customer pays attorney fees in disputes (asymmetric)
- Vendor changes Terms unilaterally with notice — push back
- Confidentiality one-way (you're bound, they're not)
- Non-compete that's overly broad

**"Customer-favorable" clauses to flip when you're the vendor**
- Unlimited liability exposure — cap at fees-paid (1x or 12 months)
- IP ownership of pre-existing work transferred to customer — scope to deliverables only
- Service level agreements with crippling SLA credits
- Termination for convenience by customer with full refund
- "Time is of the essence" without your control over delays
- Most-favored-customer clauses (compete with your business)

**Universal contract scrutiny**
- Governing law and venue — favorable to you?
- Dispute resolution — arbitration (cheaper, private) vs. court (more leverage, public)
- Notice provisions — where, how, who's legally noticed?
- Assignment — can either party assign? Change of control treatment?
- Force majeure — fair to both? Includes pandemic / war?
- Severability — does the contract survive if one clause is void?
- Survival clause — what survives termination?
- Integration / entire agreement — wipes out prior promises; make sure your important promises are IN the document

### Employment / Contractor

**Red flags for the employee/contractor side**
- Non-compete scope (geographic, temporal, role-specific) — many jurisdictions void overly broad ones
- Non-solicit (clients, employees) — narrower than non-compete, more enforceable
- Inventions / IP assignment — does it grab your prior or outside work? Make sure properly scoped.
- "At-will" with severance carve-outs you can actually enforce
- Bonus / commission terms — when earned, when paid, what happens if you leave
- Equity vesting and post-termination treatment
- Garden leave provisions
- Confidentiality scope — broad enough to be a stealth non-compete?

**Red flags for the company side**
- Misclassification risk (contractor who's really an employee)
- Wage/hour / overtime compliance
- ERISA / benefits compliance
- Anti-discrimination / harassment policies
- Background check compliance (FCRA in US)
- IP ownership — make sure work-for-hire actually applies; sometimes needs explicit assignment

**Cross-border employment**
- Tax nexus — does the employee's location create company tax presence?
- Permanent establishment risk
- Local labor laws override contract terms in many jurisdictions
- Visa / work permit compliance

### IP / Licensing

**Red flags**
- Ambiguous ownership of pre-existing IP vs. work product
- Licenses without scope (field of use, geography, term, exclusivity)
- Sublicensing rights unclear
- Improvements / derivatives — who owns?
- Audit rights and termination for breach
- Reverse engineering / decompilation prohibitions (may be unenforceable in EU)
- Open-source compliance — viral licenses (GPL family) in commercial product
- Trademark license without quality control provisions (can void mark)

### Litigation / Disputes

**Red flags**
- Cease & desist letter received — DON'T respond substantively until counsel reviewed
- Demand letter with deadline — clock is running, but don't react under pressure
- Subpoena / discovery request — preserve documents; do not destroy or alter
- Mention of "fiduciary duty," "fraud," "willful," "tortious" — escalating language
- Counterparty hires litigation counsel (vs. transactional) — they're preparing
- Threats of public disclosure, regulator complaints — escalation ladder, take seriously
- Mediation / arbitration clause invoked — formal proceeding starting

**Tier 2 trigger:** Any of these. Engage counsel before responding.

---

## Jurisdiction-Specific Watchouts

### US-specific
- State varies enormously on non-compete enforceability (CA = void, FL = liberal, etc.)
- Securities regs by state (blue sky)
- Choice-of-law clauses sometimes overridden by public policy
- FTC scrutiny on non-compete + dark-pattern contracts
- AB-5 / contractor classification battles in California
- Class-action waivers in arbitration — enforceability varies

### Indonesia (example jurisdiction)
- All RE foreign-ownership rules above
- BKPM approval for foreign investment thresholds
- Tax: NPWP requirements, withholding, PPN (VAT)
- Notaris-witnessed (PPAT) for major transactions
- Indonesian Civil Code + customary law dual track
- Anti-corruption (KPK) — be very careful with any "facilitation payments"
- Imigrasi — visa/permit compliance for foreigners doing business
- Currency controls — large transfers may trigger reporting

### EU/UK
- GDPR for any deal touching personal data
- VAT registration thresholds
- UK Bribery Act (extraterritorial)
- Consumer protection regs (B2C) more aggressive than US

### General cross-border
- Tax residency rules
- Withholding tax on payments
- Currency and capital control rules
- Treaty benefits / DTA (double-tax agreements)
- Sanctions / OFAC compliance (US persons doing biz abroad)

---

## Tier 1 Research Protocol (when triggered)

When you escalate to Tier 1, use WebSearch + WebFetch to pull current information. Suggested query patterns:

### For real estate
- "[Jurisdiction] real estate closing costs allocation buyer seller"
- "[Jurisdiction] handover defect remedies"
- "[Country] foreign property ownership restrictions [year]"
- "Indonesia PT PMA real estate [current year]"
- "Indonesia nominee structure enforceability [court case]"

### For equity / securities
- "[Country] founder vesting standard terms [current year]"
- "Reg D [year] requirements accredited investor"
- "SAFE vs convertible note tax treatment [year]"
- "Liquidation preference 1x 2x participating market data [year]"

### For employment
- "[State/Country] non-compete enforceability [current year]"
- "[Jurisdiction] contractor employee classification test"

### For contract disputes
- "[Specific clause type] case law [jurisdiction] [year]"
- "[Counterparty type] breach remedy [jurisdiction]"

### For Indonesia-specific
- "Indonesia foreign investment 2026" (or current year)
- "Indonesia property handover dispute"
- "Indonesia BKPM PT PMA regulations [year]"
- "Indonesia notaris PPAT closing procedures"

After research, output a 1-paragraph "current law summary" with sources, and 2-3 named lawyer questions specific to the user's situation.

---

## When you must say "Get a lawyer NOW"

Tier 2 triggers — stop and tell the user to engage counsel before doing anything else:

1. Active litigation against him or filed by him
2. Criminal exposure (fraud, securities, tax)
3. Cross-border tax structuring where mistakes have permanent consequences
4. Regulatory enforcement (SEC, FTC, BKPM, etc.)
5. Real estate dispute where filing deadlines are running
6. IP disputes with claims of willful infringement
7. Employment disputes with discrimination / harassment allegations
8. Anything where the counterparty has retained litigation counsel and is making formal demands
9. Anything tagged with "fiduciary," "fraud," "willful," "trade secret," "constructive trust"
10. Anything where the user is about to sign a release / settlement / waiver

In these cases, your only deliverable is an interim "buying time" message and a hard recommendation to engage counsel. Do NOT draft substantive responses. Do NOT recommend tactics. The risk of being wrong is asymmetric.

**Interim message template:**

> Hey [name] — I've received your email and I want to make sure I respond thoughtfully. Give me a few days to review and get back to you with a substantive reply.
>
> [Your name]

That's it. Don't say more. Then they engage a lawyer, and you re-engage with the deal-negotiator skill once counsel is in the loop.

---

## Who the user should have on speed-dial

Depending on their portfolio, the user likely needs (or should have) relationships with:

1. **A Delaware / US startup lawyer** — for equity, term sheets, company-formation structures
2. **A local commercial lawyer in the relevant foreign jurisdiction** — for cross-border real estate / entity structuring, foreign-investment vehicles, RE, nominees (e.g., an Indonesian commercial lawyer for an Indonesia deal)
3. **A US contracts lawyer** — for client MSA / SOW reviews, vendor agreements
4. **A US tax CPA familiar with foreign-source income / treaties** — for cross-border or expatriate tax status
5. **A local tax advisor in the relevant foreign jurisdiction** — for entity tax compliance if they set up operating entities abroad

If any of these are absent and the deal in front of them touches that domain — name it. "You don't have a local commercial lawyer on speed-dial for this jurisdiction, and this deal needs one. Want me to find candidates?"

---

## Documentation hygiene (always)

Regardless of tier, drill these into the user's deals:

1. **Get it in writing.** Verbal promises don't survive contradictions. The contract is the deal.
2. **Read the actual document.** Don't operate on summaries. Especially on signature day.
3. **Keep the email trail.** Every meaningful negotiation point should have email evidence.
4. **Don't sign anything you don't understand.** Ever. If you can't explain it in plain English, you can't sign it.
5. **Save executed copies.** Cloud-synced, backed-up, organized by deal.
6. **Note the dates.** Limitation periods, opt-out windows, renewal dates — calendar them.

---

## Output integration

When the deal-negotiator skill produces a response, the legal-layer output should fold in at the **"RED FLAGS / LEGAL NOTES"** section of the standard template. Format:

```
## RED FLAGS / LEGAL NOTES

[Tier 0 default]
RED FLAGS:
- [Issue]: [plain-language risk] → Ask a lawyer: [specific question]
- [Issue]: [plain-language risk] → Ask a lawyer: [specific question]

[Tier 1 — when triggered]
JURISDICTION CHECK (web-researched):
[1-2 paragraph summary of current relevant law with sources]
LAWYER QUESTIONS:
- [Specific question]
- [Specific question]

[Tier 2 — when triggered]
⚠ COUNSEL REQUIRED BEFORE RESPONDING
- [Reason]
- Suggested interim message: [time-buyer template, no substance]
- Lawyers to call: [type / specialty]
```

Never bury legal flags. Surface them clearly. Counterparties exploit structural gaps — this layer's job is to make sure that stops.
