# Customer Data Notes

**Sources:** git.soma.salesforce.com/bfioregartland/multi-pov-synthesis (branch: main)
**Key files:** cross_funnel_and_recs_aug2026, cs_support_top_asks_sep2026_detailed,
canvas_customer_synthesis_2026-08, agentforce_success_patterns_delivery_2026,
system_of_agency_insights_2026, drop1/2/3_synthesis_aug2026
**Period:** May–September 2026

---

## Funnel Drop-Off Reality

This is the most important number in the entire dataset:

| Stage | Accounts | Drop |
|---|---|---|
| SKU Provisioned | ~31,600 | — |
| Agent Created | ~16,113 | **49% never create a single agent** |
| Agent Being Used (consistent) | ~3,222 | ~80% drop after creating |
| Scaled Agent Usage | ~1,289 | ~92% of creators never reach scale |

**Implication for the map:** The biggest opportunity is not improving Stage 3 or 4 — it's preventing the 49% drop between Stage 1 and Stage 2. The mechanisms are data unreadiness, missing business owner, and licensing gaps — not technical complexity.

---

## Cross-Stage Patterns

### 1. The 90/10 Inversion
Traditional SaaS: 90% build, 10% manage.
Agentforce: **10% build, 90% manage.**
> "With agents, it's 10% build, 90% manage. The one person who understands agents gets consumed by maintenance." — Slalom

No platform tooling exists for this 90%. Fleet management, observability, cost attribution, and governance tooling are all gaps.

### 2. Data Readiness is the Silent #1 Blocker
Customers and even FDEs routinely misdiagnose data problems as agent/prompt problems.
- Altria sandbox: "schema-complete but content-empty (0 Chatter posts, 0 ContentNotes, 0 KA PDFs)"
- Shaklee: "40–50% of data missing"
- Skechers: "catalog data quality is the #1 make-or-break dependency to prevent hallucinations"

### 3. Business Owner is Binary for Success
> "100% of our cases that are successful, there is business people owning the agent. If it's an IT engagement, it will fail." — Charly Arguindegui, LATAM

No exceptions found in the dataset. The map should surface this in Stage 1, not treat it as implicit.

### 4. Trust is Fragile and Non-Linear
Unannounced platform changes have broken live deployments (Adecco). Partner quotes:
- Slalom-EMEA: "damages the trust our customers have"
- Accenture: "releases to production without previous notice affects the trust we've been working with customers to build"
Customers who hit a Sev0/1/2 incident can regress from Stage 3 back to Stage 2 sentiment.

### 5. Existential Risk: High-Volume Bypass
Indeed moved its high-volume text service agent off Agentforce entirely to a DIY pattern accessing Data Cloud directly via MCPs. Nike is exploring the same. Leadership flagged this as "existential revenue risk."

---

## Pain Point Inventory by Stage

### SKU Provisioned / Purchase
| Pain Point | Severity | Evidence |
|---|---|---|
| Data not ready to build on | HIGH | Altria, Shaklee, Skechers |
| No named business owner | HIGH | 100% of IT-led engagements fail (Arguindegui) |
| Licensing / SKU gaps | HIGH | Williams-Sonoma (MC Next + SRA), ADP NLQ V2 |
| Cost uncertainty | HIGH | SalesFix; AMER + EMEA PABs independently |
| Internal governance gates | MEDIUM | Ford, J&J |

### Agent Created
| Pain Point | Severity | Evidence |
|---|---|---|
| Generic "Something went wrong" errors | HIGH | 268 cases; HPE ($3.3M), Pfizer |
| Sandbox → prod migration broken | HIGH | Cupix (blocked since early 2026), HBF Health ($1M), athenahealth ($1M) |
| Prod behavior differs from sandbox | HIGH | 276 hallucination cases; Wyndham, OpenTable |
| No production-scale testing | HIGH | Staples ($1M, 1,100-user kickoff); Scottish Power |
| Configuration learning curve | HIGH | 80% of work is data prep, not prompting |

### Agent Being Used
| Pain Point | Severity | Evidence |
|---|---|---|
| Voice latency | HIGH | ADP (19.5–21s), MUFG (30s+), Xero (11.8s), USPS (P95 60s) |
| Hallucinations | HIGH | 276 cases; PrimeSource ($3.1M) exec sponsor lost confidence |
| Unannounced platform changes break live agents | HIGH | Adecco; 17 Sev0/1/2 incidents Q3 2026 |
| Billing opacity | HIGH | 439 cases Jul–Sep; Flight Centre ($8.5M), Sky Deutschland |
| No NGA observability | HIGH | Pearson; NGA agents hide reasoning detail |
| File upload not supported | HIGH | Renault (WhatsApp); Sev1 open since March 2026 |

### Scaled Agent Usage
| Pain Point | Severity | Evidence |
|---|---|---|
| Observability data lag | HIGH | Amazon Blink (3-hour lag); Wolverine data errors |
| Cost attribution impossible | HIGH | L'Oréal (budget cycle blocked); Adecco (12-country legal obligation) |
| No fleet management tooling | HIGH | "10% build, 90% manage" (Slalom); Lennar benchmarks Sierra |
| Custom Apex latency ceiling | HIGH | ADP (19.5–21s); McAfee; Phil Mui flags as "existential" |
| High-volume bypass risk | HIGH | Indeed off-platform; Nike exploring same |
| No voice quality observability | HIGH | Adecco; "transcript isn't enough" |

---

## Key Customer Quotes

> "100% of our cases that are successful, there is business people owning the agent. If it's an IT engagement, it will fail."
— Charly Arguindegui, LATAM

> "Should we build agents if they're going to cost us half a million dollars a year?"
— SalesFix (Outcome-Driven ADLC)

> "Stuff is tested one week then it's different the next week because the product's been updated in the background. No one's told us. Damages the trust our customers have."
— Slalom-EMEA

> "With agents, it's 10% build, 90% manage. The one person who understands agents gets consumed by maintenance."
— Slalom

> "A transcript isn't enough: timing is invisible, you can't self-audit, you can't log unknown signals. Only audio enables self-correction."
— Adecco

> "Data preparation is 80% of the work; prompt engineering is 20%."
— System of Agency synthesis

---

## Accounts Named in Data

These accounts appear with specific evidence. Handle with appropriate sensitivity.

**Stage 1 blockers:** Altria, Shaklee, Skechers, Williams-Sonoma, ADP, VGW, Ford, J&J, SalesFix, Merkle (PAB)

**Stage 2 blockers:** HPE ($3.3M AOV), Pfizer, Cupix, athenahealth ($1M), HBF Health ($1M), Wyndham, Staples ($1M), OpenTable, Scottish Power, ADP (war room)

**Stage 3 incidents:** ADP, MUFG, Xero, USPS, PrimeSource ($3.1M), Adecco, Flight Centre ($8.5M), Sky Deutschland, Renault, Pearson, BlueYonder

**Stage 4 / scaling:** L'Oréal, Adecco (12 countries), Amazon Blink, Wolverine, Indeed (off-platform), Nike (exploring off-platform), Lennar (benchmarks Sierra)

**Success stories (positive evidence):** Adecco (voice deflection), Wolverine (confirmed deflection rate), ADP (built own test harness)

---

## Data Gaps (things we don't know yet)

- What does the journey look like for SI/partner-led vs. direct deployments? (may need a separate map)
- What does the journey look like for customers who DON'T have a named FDE? (currently invisible)
- What causes Stage 3 → Stage 2 regression? (trust incidents? billing surprises? leadership change?)
- Are there segment differences between Service Agent vs. Sales Agent vs. internal (Coworker) use cases?

---

## How to Add Data to the Map

1. Open `src/data/journeyData.js`
2. Add a new object to the `TOUCHPOINTS` array with the correct `stageId` and `lane`
3. For pain points, set `severity: 'high' | 'medium' | 'low'`
4. Update the `sentiment` value on the matching STAGE if the emotional arc should change
5. Document the source in this file under the relevant stage section
