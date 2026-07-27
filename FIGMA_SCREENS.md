# NeuroGit — Screen Content Guide (for Figma)

Product: **Code Archaeology** — reconstructs *why* code exists by cross-referencing commit history with meeting transcripts, not just what it does. Below is every screen, grouped by whether it's kept as-is, modified, or new. Each entry describes what the screen is *for* and what content lives on it — layout/visual design is left to Figma.

---

## Kept as-is

### 1. Landing Page
Marketing entry point — needs to explain the *actual* product, not generic AI-tool copy. Real content to convey:
- **Headline concept**: NeuroGit reconstructs *why* code exists, not just what it does — by cross-referencing your git commit history with your team's meeting discussions.
- **The problem it solves**: institutional knowledge loss — the reasoning behind a decision lives in a meeting that happened months ago and evaporates once the person who made the call leaves or forgets.
- **How it works, in 3 steps**: (1) connect a GitHub repo, (2) upload team meeting recordings, (3) NeuroGit automatically links commits to the discussions that likely motivated them, and generates a browsable "Decision Record" for each.
- **Concrete example/demo snippet**: a sample "Ask Why" exchange — e.g. question: "why does auth use JWT instead of sessions?" → answer citing a specific commit hash and a specific meeting excerpt — to make the pitch tangible rather than abstract.
- **Differentiator callout**: unlike generic AI code-chat tools (Copilot, Cursor, etc.) that only explain *what* code does, NeuroGit is the only tool that reconstructs *why*, using evidence you already generate (commits + meetings).
- CTA to sign up.

---

## Kept, not designed here

### 2. Create Project
Form to link a new GitHub repo: repo URL, project name, and a credit-cost preview (based on repo file count) before committing.

### 3. Billing / Credits
Current credit balance, top-up flow via Stripe, past transaction history.

### 4. Team / Invite
Generate an invite link for a project, view current team members, and the landing screen someone sees when they open an invite link to join.

---

## Modified in content

### 5. Project Dashboard (home)
Entry point into archaeology, not just a chat box. Shows: recent commits (flagged if a meeting discussion is linked), recently generated Decision Records, a quick "ask why" input, and a shortcut to upload a meeting.

### 6. Commits View
Same commit list as before, but each commit now shows whether it has a matched meeting discussion, plus a one-line "why" teaser if a Decision Record exists for it.

### 7. Meeting Detail (chapters)
Same chapter/issue list as before, but each chapter now shows which commit(s), if any, it's linked to.

---

## New screens

### 8. Ask Why
Dedicated question screen, separate from generic code chat. User asks "why is X built this way"; the answer cites both the specific commit and the specific meeting excerpt it was reconstructed from, shown side by side.

### 9. Decision Records Feed
The centerpiece screen: a browsable, searchable list of auto-generated "why" narratives across the whole project, ordered most-recent or most-significant first. This is the "institutional memory" view — what a new hire scrolls through to ramp up.

### 10. Decision Record Detail
One narrative in full: the reasoning trail (Context → Decision → Rationale → Consequences), the commit it's tied to, the meeting chapter(s) it was pulled from (with a link back to that meeting), and a confidence/match-strength indicator since links are AI-inferred, not guaranteed.

### 11. Q&A History
Repurposed from the old saved-answers page into a history specifically for "why" questions and their citations. (Old generic code Q&A can fold into this as a secondary tab, or stay separate — a call to make once it's in Figma.)

---

**Total: 11 screens** — 1 landing page (content rewritten), 3 kept but not detailed here (auth-adjacent/utility flows), 3 lightly modified, 4 net-new.
