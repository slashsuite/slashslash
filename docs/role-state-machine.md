# The role state machine, as it runs today

This document records what the skills and the code actually do to a piece of work, from an idea to a closed ticket. It
is written so `/how-it-works` can be checked against it, and so a dashboard can place live tickets on it.

- `docs/role-state-machine.json` is the source of truth: 26 states and 44 transitions. Each state has its role, whether a
  human is required, and whether it is terminal. Each transition has its event, actor and source `file:line`.
- `docs/role-state-machine.mmd` is the Mermaid `stateDiagram-v2` drawn from that JSON. It has one state per JSON state and
  one arrow per JSON transition, and the arrow labels are the JSON `label` field. Human states carry the `human` class
  (yellow, thick border), and the terminal states lead to `[*]`. If you change the JSON,
  keep the two in step: there is no generator in this repo, so a change to the JSON is copied into the diagram by hand,
  one arrow per transition in JSON order.

**Sources and the commits read.** Paths starting `skills/` are `skills/<name>/SKILL.md` in the omnibus repo at `74cca003`
(2026-11-21). Paths starting `platform/` or `apps/cli/` are in the omnislash repo at `08b9917` (2026-11-23). Line numbers
are at those commits. Where a skill and the code disagree, both are recorded below with the one that runs today.
Neither is resolved here.

## Roles

| Role | What it is |
|---|---|
| owner | The human. Has the idea and makes the calls no agent may. |
| muse | The `ob-muse` skill in the owner's thread: explores the design, then hands it over. |
| architect | One standing thread per team. Drills tickets, dispatches builders, and gates when there is no sentinel. |
| checker | A Haiku subagent the architect runs for a blind second score. It is not a standing seat (`skills/ob-architect/SKILL.md:401`). |
| builder | One T3 thread per ticket (a spinoff) in its own worktree. Builds, reviews, opens the PR and hands off. It never merges. |
| reviewer | The read-only skeptical review legs, one per model, run on the builder's diff. |
| sentinel | One standing thread per team. Gates the PRs, merges, deploys and closes. |
| system | The spinoff launcher: queue, claim, launch, retry. |

## 1. Every state and the event that moves it

The table lists every transition in the JSON, in the same order.

**Idea to ticket**

| From | To | Event | Actor | Source |
|---|---|---|---|---|
| idea | exploring | owner opens `/ob-muse` for a project | owner | `skills/ob-muse/SKILL.md:13` |
| exploring | confirm_complete | the thought looks whole; the muse asks with the question tool | muse | `skills/ob-muse/SKILL.md:22` |
| confirm_complete | exploring | owner says no, or "let me think" | owner | `skills/ob-muse/SKILL.md:24` |
| confirm_complete | ticketed | owner says yes: `ob add`, then `t3_thread_send` (queue) to the team architect | muse | `skills/ob-muse/SKILL.md:23` |
| exploring | parked_idea | owner asks to note a raw idea: `ob add` and tag `idea` | muse | `skills/ob-muse/SKILL.md:24` |
| parked_idea | confirm_complete | owner comes back to the idea | owner | `skills/ob-architect/SKILL.md:261` |

**Drilling and measure twice**

| From | To | Event | Actor | Source |
|---|---|---|---|---|
| ticketed | drilling | the ticket is among the next three in the architect's queue | architect | `skills/ob-architect/SKILL.md:341` |
| drilling | checking | architect seals its own score and runs the checker on `ob spinoff brief` | architect | `skills/ob-architect/SKILL.md:401` |
| checking | go | `ob spinoff check`: every checker question resolved (go) | architect | `skills/ob-architect/SKILL.md:415` |
| checking | drilling | an unresolved question (no-go): change the ticket, at most twice more | architect | `skills/ob-architect/SKILL.md:418` |
| drilling | owner_plan_call | the open question is the owner's to answer | architect | `skills/ob-architect/SKILL.md:422` |
| owner_plan_call | drilling | owner answers | owner | `skills/ob-architect/SKILL.md:422` |
| drilling | spike | only trying can answer the unknown: a spike ticket (needs Questions, Box, Done when) | architect | `platform/cli-coord/src/spinoff-check.ts:368` |
| spike | drilling | the spike answers with `ob note` on the parent; the architect rescores | builder | `skills/ob-architect/SKILL.md:434` |
| spike | spike_closed | `ob close` on the spike; its row ends `failed` with a spike error | architect | `platform/cli-coord/src/commands/spinoff.ts:3192` |
| drilling | go | still under 70 after two tries: dispatch with `--no-check '<why>'` | architect | `platform/cli-coord/src/spinoff-check.ts:329` |

**Launch**

| From | To | Event | Actor | Source |
|---|---|---|---|---|
| go | queued | `ob spinoff <ref>`; refused without a Drilled section, a Done when list and a go | architect | `platform/cli-coord/src/commands/spinoff.ts:6340` |
| queued | launching | the launcher claims the row | system | `platform/cli-coord/src/commands/spinoff.ts:1991` |
| launching | building | the T3 thread opens; the row is stamped `launched` | system | `platform/cli-coord/src/commands/spinoff.ts:2067` |
| launching | queued | spawn failure or stale claim, under `MAX_LAUNCH_ATTEMPTS` (2, `spinoff.ts:2814`) | system | `platform/cli-coord/src/commands/spinoff.ts:2142` |
| launching | failed | spawn failure at the attempt cap | system | `platform/cli-coord/src/commands/spinoff.ts:2144` |
| queued | failed | abandoned before launch | architect | `platform/cli-coord/src/commands/spinoff.ts:498` |
| building | failed | abandoned, or the losing side of a trial pair | architect | `platform/cli-coord/src/commands/spinoff.ts:2294` |

**Build, review and handoff**

| From | To | Event | Actor | Source |
|---|---|---|---|---|
| building | reviewing | build and local gate done; review legs run on `git diff main...HEAD` | builder | `skills/ob-spinoff/SKILL.md:181` |
| reviewing | building | a finding, or a rejected answer, is still open: fix, then a rebuttal round | reviewer | `skills/ob-skeptical-review/SKILL.md:266` |
| reviewing | pr_ci | 0 open: rebase, push, `gh pr create` | builder | `skills/ob-spinoff/SKILL.md:212` |
| pr_ci | building | a CI check fails; the handoff refuses until it is fixed | builder | `platform/cli-coord/src/commands/spinoff.ts:6036` |
| pr_ci | handed_off | verdict landable and CI green: `ob spinoff handoff` | builder | `platform/cli-coord/src/commands/spinoff.ts:3539` |
| pr_ci | needs_human | verdict needs-human; the builder asks with the question tool | builder | `skills/ob-spinoff/SKILL.md:114` |
| needs_human | handed_off | owner runs `/ob-spinoff-handoff` (the human yes) | owner | `skills/ob-spinoff/SKILL.md:246` |
| needs_human | building | owner answers with a change to make | owner | `skills/ob-spinoff/SKILL.md:114` |
| building | blocked | verdict blocked: a decision or access is missing; no PR | builder | `skills/ob-spinoff/SKILL.md:117` |
| building | partial | verdict partial: some Done when items unmet; no PR | builder | `skills/ob-spinoff/SKILL.md:119` |
| blocked | building | owner gives the decision or access | owner | `skills/ob-architect/SKILL.md:103` |
| partial | building | architect redispatches or steers the rest | architect | `skills/ob-architect/SKILL.md:102` |

**Gate, merge and close**

| From | To | Event | Actor | Source |
|---|---|---|---|---|
| handed_off | gating | the sentinel (else the architect) reads its inbox, oldest first, and starts the gate | sentinel | `apps/cli/src/inbox.ts:93` |
| gating | building | red CI, an unmet Done when item, or a claim it cannot verify: `ob spinoff sendback` | sentinel | `platform/cli-coord/src/commands/spinoff.ts:3580` |
| gating | updating_pr | the PR conflicts, or is behind main with an overlap | sentinel | `skills/ob-sentinel/SKILL.md:35` |
| updating_pr | gating | rebased or merged main, pushed; re-gate the new head | sentinel | `skills/ob-land/SKILL.md:75` |
| gating | owner_merge_call | a taste call, a waived check, or a known flake | sentinel | `skills/ob-sentinel/SKILL.md:51` |
| owner_merge_call | gating | owner answers | owner | `skills/ob-land/SKILL.md:198` |
| gating | merged_deployed | every gate question is yes: `gh pr merge --squash`, then `ob deploy run --sha` | sentinel | `skills/ob-sentinel/SKILL.md:33` |
| merged_deployed | closed | `ob close`: ticket done, rows landed, unread handoffs withdrawn | sentinel | `apps/cli/src/close.ts:20` |
| closed | building | `ob spinoff reopen`: an exception for a row that reconcile landed although nothing merged | architect | `platform/cli-coord/src/commands/spinoff.ts:3622` |

**Spinoff rows have their own small machine underneath.** `SPINOFF_TRANSITIONS`
(`platform/cli-coord/src/commands/spinoff.ts:497-506`) is the whole table, and `moveSpinoff` (`spinoff.ts:531`) is the
only writer:

| Row status | May move to |
|---|---|
| `pending` | `launching`, `failed` |
| `launching` | `launched`, `pending` (retry), `failed` |
| `launched` | `launched`, `ready-for-gate`, `merged`, `pending`, `failed` |
| `ready-for-gate` | `launched` (sendback, `spinoff.ts:3580`), `merged`, `failed` |
| `merged` | `launched` (reopen only, `spinoff.ts:3622`) |
| `failed` | nothing |

The stored words show as queued, launching, building, handed-off, landed and failed
(`platform/cli-coord/src/spinoff-vocab.ts:17-24`). Every state in this document from `queued` to `closed` sits on one of
those row values (see section 7).

## 2. The paired loops

Each loop pairs a doer with a checker that can send the work back.

**Architect and checker (measure twice).** The architect drills the ticket and seals its own score. A Haiku checker then
scores the same ticket blind, from `ob spinoff brief` alone (`skills/ob-architect/SKILL.md:380-425`).

- `ob spinoff check` compares the two scores and returns go or no-go (`platform/cli-coord/src/spinoff-check.ts:97-102`).
  Only checker questions the ticket does not answer make it a no-go.
- On a no-go the architect changes the ticket and checks again, at most twice (`skills/ob-architect/SKILL.md:418`).
- A ticket still under 70 after that is dispatched with `--no-check '<why>'` (`spinoff-check.ts:329`).
- `refuseUncheckedDispatch` blocks `ob spinoff` without a Drilled section, a Done when list and a go
  (`spinoff-check.ts:329`, called at `spinoff.ts:6340`).
- If only trying can answer the unknown, the ticket becomes a spike that answers on the parent ticket
  (`skills/ob-architect/SKILL.md:427-438`).

**Builder and skeptical reviewer.** Before it opens the PR, the builder runs the review legs on its own diff, one leg
per model, all read-only (`skills/ob-spinoff/SKILL.md:181`).

- The readers presume every changed line is wrong.
- From round 2 on, each round is a rebuttal pass. An answer the readers reject stays open and blocks landable
  (`skills/ob-skeptical-review/SKILL.md:264-274`).
- Only with 0 open does the builder push and open the PR (`skills/ob-spinoff/SKILL.md:212`).

**Sentinel and builder (the gate).** The sentinel gates every handoff with five questions and "verify, never trust"
(`skills/ob-sentinel/SKILL.md:38-54`).

- It sends the work back with `ob spinoff sendback` (`platform/cli-coord/src/commands/spinoff.ts:3574-3580`) when it
  finds red CI, an unmet Done when item, or a claim it cannot reproduce. The row goes from `ready-for-gate` back to
  `launched`, and the builder fixes and hands off again.
- When the PR conflicts with main or overlaps it, the sentinel updates the PR itself instead of sending it back
  (`skills/ob-sentinel/SKILL.md:35`, `skills/ob-land/SKILL.md:75`). It tells the architect (`skills/ob-sentinel/SKILL.md:36`).

## 3. One sentinel, many builders

- **Fan-in.** `ob spinoff handoff` routes the note through `teamHandoffTarget` (`apps/cli/src/team.ts:300-331`,
  called from `platform/cli-coord/src/commands/spinoff.ts:4116`). The note goes to the ticket's team sentinel when that
  seat has a thread (`team.ts:329`). It is stored in the role inbox with `sendRoleMessage` (`spinoff.ts:4132`). Every
  builder on every project of that team lands in the same inbox.
- **Taking the work.** Before it gates, the gating thread takes the `ticket:` and `worktree:` leases under its own
  holder name (`skills/ob-land/SKILL.md:59-60`). A live hold by someone else stops it (`skills/ob-land/SKILL.md:44`).
- **Ordering.** The inbox lists unread messages oldest first (`apps/cli/src/inbox.ts:93-99`). Delivery queues them into
  the sentinel's open run, so a busy sentinel finishes its turn before it reads the next one
  (`apps/cli/src/role-deliver.ts:1-6`). With no open run, a new run starts with every unread message in its brief.
- **No sentinel.** With no sentinel thread bound, the same note goes to the team's architect (`team.ts:330`), who gates,
  merges and closes in the sentinel's place. The row's note says so: "handed-off: the sentinel, else the architect,
  gates it" (`spinoff.ts:3548`).
- **No team.** A project in no team gets no note at all (`team.ts:314`, `:321`, returning `skip`). The row still reaches
  `ready-for-gate` and shows on `ob spinoff gateable`, but no thread is told.

## 4. Bounce-backs and terminal states

**Bounce-backs** (arrows that go back to an earlier state):

| Bounce-back | Why |
|---|---|
| confirm_complete → exploring | the owner says the thought is not complete |
| checking → drilling | the checker gives no-go |
| spike → drilling | the spike's answers rescore the parent |
| launching → queued | a launch retry |
| reviewing → building | a review finding is open |
| pr_ci → building | CI is red |
| needs_human → building | the owner asks for a change |
| blocked / partial → building | unblocked, or redispatched |
| gating → building | the sentinel sends it back |
| updating_pr → gating | re-gate after the sentinel updates the PR |
| closed → building | reopened |

**The verdicts.** A builder ends a build with one of `landable`, `needs-human`, `blocked` or `partial`
(`platform/cli-coord/src/spinoff-vocab.ts:61`; `ready` is the old spelling of `landable`).

| Verdict | Where it is stored | PR | Next |
|---|---|---|---|
| landable | `ob spinoff state` in a clean repo (`recordSpinoffVerdict`, `spinoff.ts:3741`), the `State:` line elsewhere | yes | handoff once CI is green |
| needs-human | same | yes | the owner judges it, then hands off or asks for a change |
| blocked | same | no | waits on the owner's decision or access |
| partial | same | no | the architect redispatches the rest |

Of these, only `landable` and `needs-human` reach the gate. None of the four is a terminal state: blocked and partial
wait for someone to act. `partial` has no transition of its own in the code; it is only a verdict recorded on a
`launched` row.

**Terminal states.** Terminal means no move in the normal flow. `closed` has one exception, `ob spinoff reopen`, which
exists only for a row that reconcile marked landed although nothing merged (`spinoff.ts:3616-3622`). The JSON keeps
`closed` terminal and lists the reopen transition, so a dashboard should treat a reopen as an exception, not a step.


| State | Row | Item | Source |
|---|---|---|---|
| closed | `merged` | `done` | `apps/cli/src/close.ts:20` (closeAndLand lands the rows and withdraws unread handoffs) |
| spike_closed | `failed` with a spike error | `done` | `spinoff.ts:3183-3192` |
| failed | `failed` | unchanged | launch cap, abandon, or lost trial (`spinoff.ts:2144`, `:2294`, `:498`) |

`merged_deployed` (merged and deployed but not yet closed) is not terminal. Reconcile also lands a handed-off row once its
ticket reads `done` (`spinoff.ts:3183-3185`).

## 5. Where a human is required

These are the six states with `human_required: true`, drawn with the `human` class in the diagram.

| State | What the owner does | Source |
|---|---|---|
| idea | has the idea and opens the muse | `skills/ob-muse/SKILL.md:13` |
| confirm_complete | says whether the thought is complete; nothing is ticketed for building before a yes | `skills/ob-muse/SKILL.md:22-24`, `skills/ob-architect/SKILL.md:261` |
| owner_plan_call | answers a planning question only he can decide | `skills/ob-architect/SKILL.md:422` |
| needs_human | judges a built change (feel, wording, anything visual), then hands it off or asks for a change | `skills/ob-spinoff/SKILL.md:114`, `:246` |
| blocked | gives the missing decision or access | `skills/ob-spinoff/SKILL.md:117`, `skills/ob-architect/SKILL.md:102-104` |
| owner_merge_call | rules on a taste call, a waived check, or merging past a known flake | `skills/ob-sentinel/SKILL.md:51`, `skills/ob-land/SKILL.md:196-198` |

Two more human touches sit outside this machine. A PixelSlash accept or reject happens inside a CI check, while the row
is in `pr_ci`. Sending anything externally always waits for the owner (`skills/ob-architect/SKILL.md:694`).

## 6. Where the skills and the code disagree

| Topic | Skill says | Code does | Runs today |
|---|---|---|---|
| Who gets a builder's handoff | the handoff "sends a readying note into this architect thread" (`skills/ob-architect/SKILL.md:618`) | the team sentinel, else the architect, through the role inbox (`apps/cli/src/team.ts:329-330`, `spinoff.ts:4116-4132`) | the code. The sentinel skill (`skills/ob-sentinel/SKILL.md:33`) and `skills/ob-architect/SKILL.md:259` agree with the code. |
| How the muse hands over | `ob add`, then one `t3_thread_send` (queue) to the architect's thread (`skills/ob-muse/SKILL.md:23`) | no code path; the role inbox (`sendRoleMessage`) is only called for builder handoffs (`spinoff.ts:4132`) | the skill: the muse's handover never goes through the inbox. `/how-it-works` step 2 says it does. |
| The checker | a Haiku subagent of the architect (`skills/ob-architect/SKILL.md:401`) | no checker seat; `ob spinoff check` only reads the recorded scores (`spinoff-check.ts:97-102`) | both agree. Only `/how-it-works` step 4 shows it as a role. |
| The item status during a build | the skills talk only in verdicts and row words | no spinoff path writes the item's `in_progress` or `ready` (`apps/cli/src/status.ts:19` lists them); the item stays `open` until `ob close` sets `done` (`close.ts:20`) | the code. A live ticket's place comes from its row and verdict, never from the item status. |
| A partial verdict | `State: partial`, with the builder staying `working` (`skills/ob-spinoff/SKILL.md:119`) | a recorded verdict on a `launched` row; no row move | both. The row looks the same as a build in progress. |

## 7. Placing live tickets on the diagram

These states are what OS-165's dashboard draws. Read three things for each ticket:

- the item status (`ob show`);
- its newest spinoff row's stored status (`ob spinoff list`, `SPINOFF_STATUSES` at `spinoff.ts:476`);
- that row's verdict (`ob spinoff state`, or the `State:` line).

The agent status (`working`, `readying`, `needs-human`, `blocked`) helps tell `building` from `reviewing`.

| State | Item status | Row status (stored → shown) | Verdict and other signals |
|---|---|---|---|
| idea, exploring, confirm_complete | no item yet | none | lives only in the owner's thread |
| parked_idea | `open` | none | tag `idea` |
| ticketed | `open` | none | no Drilled section yet |
| drilling, checking, owner_plan_call | `open` | none | Drilled section present; check records on the ticket |
| go | `open` | none | a go is recorded on the current text |
| spike | `open` | `launched` → building | tag `spike`; a spike's handoff leaves the row `launched` and never moves it to `ready-for-gate` (`skills/ob-architect/SKILL.md:436`) |
| queued | `open` | `pending` → queued | |
| launching | `open` | `launching` → launching | |
| building | `open` | `launched` → building | no verdict; agent status `working` |
| reviewing | `open` | `launched` → building | no verdict; agent status `readying`, which the skill stamps for the whole gate (`skills/ob-spinoff/SKILL.md:26`), so it also covers `pr_ci`. No stored signal separates reviewing from building. |
| pr_ci | `open` | `launched` → building | verdict `landable` (or `needs-human`); a PR is open, checks pending |
| needs_human | `open` | `launched` → building | verdict `needs-human`; agent status `needs-human` |
| blocked | `open` | `launched` → building | verdict `blocked`; agent status `blocked` |
| partial | `open` | `launched` → building | verdict `partial` |
| handed_off | `open` | `ready-for-gate` → handed-off | handoff unread in the sentinel or architect inbox |
| gating, updating_pr, owner_merge_call | `open` | `ready-for-gate` → handed-off | handoff read; the gating thread holds the `ticket:` lease. These three cannot be told apart from stored data today. |
| merged_deployed | `open` | `ready-for-gate` → handed-off (until close or reconcile lands it), or `merged` → landed | PR merged; ticket not yet closed. Only the PR's merged state separates this from gating. |
| closed | `done` | `merged` → landed | |
| spike_closed | `done` | `failed` with a spike error | tag `spike` |
| failed | `open` | `failed` → failed | row error says why |

Because the item stays `open` from ticket to land, the item status alone separates only three groups: no item, `open`,
and `done`. The row status and the verdict do the rest.

## 8. Where `/how-it-works` is wrong or silent, and the follow-ups

`apps/site/src/content/how-it-works-steps.ts` shows ten straight steps. Against this machine:

| Where the page is wrong or silent | Follow-up |
|---|---|
| **Wrong:** the skeptical review is step 8, after the handoff in step 7. The builder runs it before the PR. | SS-131 |
| **Wrong:** step 2 says the muse's handoff goes through the role inbox. It goes by `t3_thread_send` to the architect's thread. | SS-132 |
| **Wrong:** step 4 shows the checker as a role. **Silent:** the no-go loop, the `--no-check` override, and spikes. | SS-133 |
| **Silent:** there are no loops at all: review rounds, the CI fix, sendback, the sentinel's PR update, reopen. | SS-134 |
| **Silent:** the human points other than the idea and PixelSlash, and the four verdicts. | SS-135 |
| **Roughly right:** step 5, "Assign and lock". There is no separate assign step: `ob spinoff` launches the builder, the builder's registration takes the `ticket:` lease (`skills/ob-land/SKILL.md:51`), and the gating thread takes it again to gate. The lease claim on the page holds. | none needed |
| **Outside this machine:** step 10, the ToggleSlash rollout. No skill or code moves a ticket after `closed`; a rollout is the product's own release step. | none needed |
| **Silent:** how one sentinel serves many builders: the inbox fan-in, oldest first, the architect fallback, and close after deploy. | SS-136 |

Every follow-up changes page copy, so it goes through the approved-copy process before a builder transcribes it.
