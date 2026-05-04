# SpendWise — Minimal Reconstruction Prompt

## ONE-LINE MISSION
Single HTML file. Bill-cycle tracker for an Indian household (Belagavi, Karnataka). Local-first. No frameworks. No build step.

---

## TECH CONSTRAINTS
- Pure HTML + CSS + Vanilla JS. One file. Works offline.
- `localStorage` keys: `sw_bills`, `sw_payments`, `sw_plans`, `sw_theme`
- Currency: ₹ Indian Rupee. Locale: `en-IN`. No categories.
- Export/Import: JSON. Keys: `{version, bills, payments, plans, theme}`

---

## DATA MODELS

```js
Bill     = { id, title, defaultAmount, dueDay(1-31), frequency, nextDueYM, important }
Payment  = { id, billId, billTitle, dueYM, amount, paidDate, isPaid, notes }
Plan     = { salary, otherIncome, inflowAmount, inflowName, fd, creditCardBills, provision, notes }
// plans stored as { "YYYY-MM": Plan }
// frequency: "monthly"|"bimonthly"|"trimonthly"|"yearly"|"one-time"
// YM format: "YYYY-MM"
```

---

## CORE ALGORITHM — billsDueIn(ym)
```js
// ALL bills where nextDueYM <= ym (one-time included — they persist until paid)
bills.filter(b => b.nextDueYM <= ym)
```

## CORE ALGORITHM — confirmPay(billId, dueYM, amount, paidDate, notes)
```js
// 1. Remove any existing payment for this billId+dueYM
// 2. Push new payment record
// 3. Advance bill.nextDueYM by frequency months:
//    monthly=+1, bimonthly=+2, trimonthly=+3, yearly=+12, one-time=+120(done)
// 4. Save + render
```

## CORE ALGORITHM — Duplicate Detection (no AI, local only)
```js
// Normalize title: lowercase → strip punctuation → split words → remove stopwords
// Jaccard(setA, setB) = intersection.size / union.size
// billScore = titleJaccard*0.6 + sameFreq*0.15 + sameDay*0.10 + sameAmount*0.15
// threshold ≥ 0.65 = likely duplicate → warn before add
// Exact payment dup = same billId + same dueYM → auto-remove on load/import
```

---

## UI — 6 TABS (bottom nav + top tab bar)

### THIS MONTH
- `billsDueIn(viewYM)` split into: Pending (Mark Paid + Del) / Already Paid (Undo + Del)
- Overdue bills (nextDueYM < currentYM): red left-border + "Overdue" badge
- Due today: amber badge

### IMPORTANT
- `bills.filter(important)` split into 3 sections:
  1. **Due now** (nextDueYM ≤ viewYM, unpaid): Mark Paid + Del
  2. **Paid this month**: Undo + Del
  3. **Upcoming** (nextDueYM > viewYM): dimmed, Del only
- All-time important payment history below

### NEXT MONTH
- Monthly bills always appear. Non-monthly only if nextDueYM = nextYM.
- Show projected total.

### PAID THIS MONTH / ALL HISTORY
- paymentHistoryCard: title, dueYM, paidDate, notes, amount, Del

### MANAGE (master list — ALWAYS sorted: Overdue → Due Now → Due Next → Future)
- Each card shows colour-coded status badge:
  - Overdue → red "⚠ Overdue since YYYY-MM" + months overdue note + Pay button
  - Due Now → amber "Due This Month" + Pay button
  - Due Next → yellow tint "Due Next Month"
  - Future → grey "Next YYYY-MM"
- Edit (all fields) + Del on every card

### MONEY PLAN (panel, not a tab — sits above tabs)
- Per-month: salary, otherIncome, inflowAmount, fd, creditCardBills, provision
- Balance = salary + otherIncome + inflowAmount − billsTotal − fd − creditCardBills − provision

---

## DEFAULT BILLS (seed on first load if localStorage empty)
```
Maintenance        ₹400    Monthly    Due 1st
Tata Play          ₹300    Monthly    Due 5th
Jio Pandu          ₹300    Monthly    Due 5th
Jio Bharati        ₹300    Monthly    Due 5th
Megha Gas (PNG)    ₹1100   Bimonthly  Due 10th
HESCOM Electricity ₹600    Monthly    Due 15th
Airtel WiFi        ₹2900   Trimonthly Due 1st
```

---

## UX RULES (non-negotiable)
1. **Never silently drop a bill.** One-time bills persist across months until paid.
2. **Confirm before pay** — modal with editable amount + date + notes field.
3. **Undo pay** = remove payment record + roll back nextDueYM by frequency.
4. **Del payment** = remove record only, cycle unchanged (annotate in confirm dialog).
5. **Del bill** = remove definition, keep payment history.
6. **Duplicate guard on Add**: run similarity check, warn if score ≥ 0.65.
7. **Auto-dedup on import/load**: remove exact payment dups (same billId+dueYM), keep latest.
8. **Scan button** in header: shows full duplicate report modal with per-item Del.

---

## THEMES (CSS custom properties, body class toggle)
4 themes: `dark` (default lime #c8f250 on #0c0c0e) | `light` | `ink` | `rose` | `forest`

---

## HEADER BUTTONS (left→right)
`Export` `Import` `Clear` `2×?`(scan dups) `T`(theme) `+`(add bill)

Month navigator: `Prev | May 2026 | Next`

---

## EXPORT FORMAT
```json
{
  "version": "1.2",
  "exportDate": "YYYY-MM-DD",
  "bills": [...],
  "payments": [...],
  "plans": { "YYYY-MM": {...} },
  "theme": "dark"
}
```
Import: parse JSON → load all keys → dedup payments → save → render → toast count.

---

## WHAT TO OMIT
- No categories, no charts, no spend analysis, no cloud, no login, no AI calls.
- No frameworks (React/Vue/etc), no CDN, no external fonts required.

---

*~600 tokens. Sufficient for Claude Sonnet, Kimi 2.6, Codex, Gemini Flash to reconstruct fully.*
