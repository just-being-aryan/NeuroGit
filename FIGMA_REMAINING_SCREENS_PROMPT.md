# Figma Prompt — Remaining NeuroGit Screens

Paste everything below into your Figma AI design tool (Figma Make / First Draft / similar). It covers the 8 screens that exist in the real app but haven't been visually polished/confirmed yet, matching the design system already refined and shipped in the live product — not the earlier rough mockup.

---

## Design system to match exactly

**Theme:** Dark only. Background `#080808`, card surface `#131313`, card hover `#1A1A1A`, borders `#222222` (subtle border `#181818`), primary accent orange `#F75500` (light variant `#FF7A29`), body text `#EFEFEF`, secondary text `#999999`, dim text `#555555`. Status colors: green `#22C55E`, blue `#60A5FA`, yellow `#FBBF24`, red `#F87171` (each also has a ~12% opacity "dim" background variant for badges/pills).

**Fonts:** Inter (body text, weights 300–600), Barlow Condensed (headings/titles, bold/extrabold, slightly condensed display feel), DM Mono (small uppercase labels, breadcrumbs, timestamps, metadata — tracked-out letterspacing).

**App shell (already built, do not redesign — match it):**
- Left sidebar + top bar are merged into ONE continuous rounded surface, floating with a small margin from the browser edges (rounded outer corners on all 4 sides of the combined shell), NOT two separate floating cards.
- Sidebar (left, ~240px): NeuroGit icon mark (an interlocking orange/red/yellow abstract loop icon) + "NeuroGit" wordmark in Barlow Condensed bold, at the top. Below it, nav groups in this exact order: **OVERVIEW** (Dashboard, Ask Why, Decision Records, Q&A History), **CODE** (Commits, Meetings), **PROJECT** (Team, Billing). Group labels are tiny DM Mono uppercase tracked-out text. Active nav item gets an orange-tinted background + orange left accent border. Below nav: a "YOUR PROJECTS" list (small colored initial-avatar squares + project name), a "New Project" button, and a user/credits footer at the very bottom.
- Top bar (right of sidebar, same row height as sidebar's header block so the divider lines stay level): mostly empty except a user avatar icon, top-right.
- Every page's content area sits below the top bar, scrollable, padded (~2rem), on the `#080808` background.

**Common patterns already established (reuse, don't reinvent):**
- Page header: tiny DM Mono breadcrumb (e.g. "DASHBOARD / PROJECT-NAME"), then a large Barlow Condensed bold page title below it.
- Stat tiles: dark card, tiny DM Mono uppercase label, large bold number, small secondary-text caption underneath.
- Confidence/match-strength badges: a percentage in a colored pill — green if ≥90%, amber if ≥75%, red below that.
- Commit hash badges: shown in orange, monospace, truncated to 7 characters (e.g. `a3f9c2e`).
- Destructive actions (delete, archive) use a confirmation dialog, not an inline action.

---

## Screens to design

### 1. Commits
Full commit history for the active project, with client-side filter/search.
- Header: breadcrumb "COMMITS / [project]", title "Commit History", search input.
- Filter tabs: All / Linked / Unlinked (with live counts) — "linked" means a commit has an associated meeting discussion.
- Each commit row: hash badge, commit message, a "MEETING LINKED" badge + short italic quoted teaser if a meeting discussion is linked, a "◆ DECISION" badge if a Decision Record exists for it, author, date. Clicking a commit with a Decision Record goes to that record's detail screen; without one, shows an inline "no decision record yet" state.

### 2. Meetings (list + detail)
Two views: a list of uploaded meetings, and a detail view of one meeting's transcript chapters.
- List: upload widget (drag-and-drop audio file) at top, then each meeting as a row — title, date, duration, status badge ("PROCESSING..." while transcribing), chapter count, "linked to N commits" if any, View/Delete actions (delete needs confirmation).
- Detail: meeting metadata card (title/date/duration/participants), then a list of transcript chapters as an accordion — timestamp, chapter title, badge showing how many commits are linked, expand to see the chapter summary + a quoted excerpt with speaker attribution, and clickable commit-hash chips for any linked commits.

### 3. Ask Why
The core differentiator screen — ask a question, get an answer that cites both a commit and a meeting excerpt.
- Header: breadcrumb "ASK WHY / [project]", title "Code Archaeology".
- Input bar: "WHY" label prefix, text input, Ask button (shows a loading/streaming state while the answer generates), a few example-question suggestion chips.
- Answer area: confidence badge, a markdown-rendered answer with inline bracketed citations like `[commit a3f9c2e]` and `[meeting "Sprint Planning" at 04:12]`, then two evidence panels side by side — "COMMIT EVIDENCE" (hash, date, message, diff summary) and "MEETING EXCERPT" (meeting name, timestamp, quoted excerpt, speaker).
- Empty state before a question is asked: simple centered icon + prompt.

### 4. Decision Records — Feed
A searchable, filterable, sortable list of every auto-generated "why" narrative for the project — the institutional-memory browsing view.
- Header: breadcrumb, title "Institutional Memory" (or "Decision Records"), search input, sort control (recent / highest confidence).
- Tag filter chips (tags are short topic labels like "auth", "scaling").
- Each card: title, one-paragraph summary, tag chips, footer meta (commit hash, date, author, meeting name if applicable), and a circular confidence-percentage ring badge. Clicking a card goes to that record's detail screen.

### 5. Decision Records — Detail
One full narrative, deep-dive view.
- Breadcrumb with the record's short id, title, tag chips.
- Confidence meter: large percentage, a progress bar, caption noting this is an AI-inferred link, not a verified fact.
- Meta row: commit hash, date, author, linked meeting name, generated-on date.
- The reasoning trail, as 4 labeled sections: **Context** (what the meeting discussed), **Decision** (what the commit did), **Rationale** (why, explicitly hedged — "likely", "suggested by the discussion"), **Consequences** (if inferable).
- Two evidence panels side by side: commit (hash, date, message, diff stat line, link to view the diff) and meeting source (title, timestamp, quoted excerpt, link to the full meeting).
- A small "how this match was made" explainer box (semantic similarity + rough time proximity).
- Actions: regenerate, export as markdown.

### 6. Q&A History
A log of past "Ask Why" questions and their saved answers.
- Header: breadcrumb, title "Question History".
- Tabs: All / Why Questions / Code Q&A (with counts).
- Each row: type badge, the question text, timestamp, confidence badge (why-type only), a preview of the answer, and citation footer (commit/meeting referenced, or "no citation"). Clicking a why-type row reopens that saved answer.

### 7. Create Project
Repo-connection onboarding form (this one is largely already real/functional — just needs the visual polish pass).
- Header: "NEW PROJECT" breadcrumb, title "Create Project".
- Form card: GitHub repo URL input, project name input.
- On entering a valid repo URL: a live credit-cost estimate appears — files found, credit cost, current balance, a progress bar of cost vs. balance.
- Create / Cancel buttons. A small "what happens next" 3-step explainer underneath.

### 8. Team
Team members and invite management for the active project.
- Header: breadcrumb, title "Team".
- Members table: avatar, name/email, role (Owner/Admin/Member — each with a distinct color), joined date, last active.
- Invite link card: read-only link + copy button.
- Invite-by-email card: email input + send button.
- A short static role-permissions legend (what each role can do).

### 9. Billing
Credits balance and usage.
- Header: breadcrumb, title "Credits & Billing".
- Balance card: current balance, used this month, total, average daily burn rate.
- Usage breakdown: a small bar chart or list by category (repo indexing, meeting transcription, Ask Why queries, decision record generation), each with its own credit cost.
- Transaction history table (date, description, amount, credit/debit).
- Top-up panel: preset credit-pack buttons, order summary, "Pay via Stripe" button, and a small reference legend of what each action costs in credits.

---

Keep every screen's page-header pattern (breadcrumb + title), stat-tile style, badge/pill conventions, and confirmation-dialog behavior for destructive actions **identical** across all 9 screens — the goal is one coherent system, not 9 independently styled pages.
