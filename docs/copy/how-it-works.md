# slashslash how-it-works: copy

Status: outline, three drafts and the persona knockout, waiting for the owner's pick. Knockout winner: Draft A; runner up: Draft C. Nothing goes to a builder until he approves the words.

## Audience

From `docs/personas/`. The page is written for Priya first: a founder, CEO or product owner, not technical, often on a phone (390px). She came to learn what the Slash suite does with her product idea and where she stays in charge. Dana (engineering manager) checks cost and control. Marcus and Sam (engineers) check that every claim is real. Leo checks the page reads well with a screen reader.

## The one thing

You bring the idea and make the calls; a team of agents shapes it, builds it, checks it and ships it, and stops for you at each decision only you can make.

## The one headline's job

One headline, the same in the h1, the footer and the share card. Its job: tell Priya, in plain English and with no product names, that her idea goes in and shipped work comes out with her in charge. Outcome first, no jargon, no claim of speed or cost the facts do not give.

## Section order

1. **Hero.** The headline and one or two lines under it: what happens to an idea, and that you approve the moments that matter. Facts: OmniSlash `role-state-machine` (idea to shipped ticket, human states marked), docs/role-state-machine.md section 3 (human points).
2. **Filmstrip, nine scenes.** One short caption per scene, each naming who acts and what you see. Products named only where a scene uses one.
   1. Explore and confirm: the muse explores the idea with you; you confirm it is complete. Facts: OmniSlash `role-skills`, role.ts labels "Muse explores the idea", "Owner confirms the idea is complete".
   2. Shape the ticket: the architect turns it into a ticket with what done means. Facts: OmniSlash `drilled-ticket-gate` (Drilled, Done when).
   3. Cold read the brief: a reviewer reads the brief with fresh eyes and sends back gaps. Facts: role.ts "Reviewer checks the brief for gaps"; OmniSlash `drilled-ticket-gate` (the `go` check).
   4. Parallel builds: builders work side by side, each in its own copy of the code, while TaskSlash keeps the computer from overloading. Facts: OmniSlash `agent-build-worktree`, `branch-conflicts`, `parallel-conflict-checks`; TaskSlash `admission-by-capacity`, `priority-classes`.
   5. Skeptical diff review before the pull request: reviewers presume every changed line is wrong. Facts: OmniSlash `review-merge-skills`, `review-run`; role.ts "Reviewer challenges the diff".
   6. Visual and automated checks: PixelSlash shows what changed on screen and a person accepts or rejects it; FlakeSlash finds tests that pass and fail on the same code; UISlash components cannot be styled wrong. Facts: PixelSlash `upload-to-review-app`, `review-app-keyboard`, `block-ci-on-review`; FlakeSlash `flake-same-commit`; UISlash `no-styling-escape`, `ui-review-workflow`; OmniSlash `gate-file`.
   7. Inbox, gate and ship: the sentinel reads one inbox for many builders, oldest first, checks each pull request, sends fixes back to the builder, merges and ships. Facts: OmniSlash `role-inbox`, `role-state-machine` (merge and ship); docs/role-state-machine.md section 5.
   8. Live rollout: ToggleSlash turns a feature on for a share of users and off again while the app runs. Facts: ToggleSlash `targeting` (roll out by percentage), `dashboard`. Must not say the agents run the rollout today: no fact links ToggleSlash to the role flow.
   9. Good night retro: at the end of the day you see what shipped. Facts: none in FACTS.md yet (see decisions log, item 4).
3. **Meet the team.** Five cards: Muse, Architect, Builder, Reviewer, Sentinel. One line each on what they do. Facts: OmniSlash `role-skills`, `role-state-machine`; role.ts persona labels. No Checker card.
4. **Where you stay in control.** The moments the flow stops for you: confirm the idea, answer a planning question, answer a builder, the merge call on anything a builder marks as needing you, PixelSlash accept or reject, and any message sent outside. Facts: docs/role-state-machine.md section 3; OmniSlash `handoff-pixelslash-owed`.
5. **Five stages.** Idea, plan, build, ship, done, with the Slash products behind each and a link to each product page. Facts: OmniSlash `role-state-machine` (stages), `dashboard-machine`; each product's "What it is".
6. **Running today and next.** Today: what is in each FACTS.md "Today". Next: OmniSlash `team-server`; TaskSlash `machine-pool`, `ci-runners`; ToggleSlash `progressive-rollouts`, `user-accounts-and-roles`; FlakeSlash `pr-check`. Every product is alpha; say so.
7. **Close.** The headline again and one call to action to the product pages.

## Facts and decisions log

1. **Facts read on origin/main of each repo, 2026-11-28.** OmniSlash d8d5903 (1 commit since, a thread sweep, not on this page). TaskSlash 0aac233 (8 since, including `cancel`, already listed). PixelSlash 78658b25 (2 since, `org-owner-role`, not on this page). UISlash 6c4c2a39 (88 since, many ui-react changes: only the stable claims `no-styling-escape` and `ui-review-workflow` are used; a facts refresh is owed on uislash). FlakeSlash 0277e42 and ToggleSlash c254941 (no feature changes since).
2. **Facts approval not verified.** The skill wants each FACTS.md approved by the owner. This run did not find a recorded yes for each; it used them as they stand.
3. **Outline approval waived for this run.** The skill asks for his yes on the outline before drafts. The team asked for drafts and the knockout overnight, so both were made; if he changes the outline, the drafts are redone.
4. **The good night retro has no product fact.** It is a workflow step, not a line in any FACTS.md. The drafts keep it to "you see what shipped today". the owner to confirm the scene stays, or ticket a fact for it.
5. **Stage five is "done", not "roll out".** The role model's stages are idea, plan, build, ship, done. The ticket's "Roll out" with ToggleSlash is shown as a scene, not a stage, and the copy does not say the agents drive a rollout.
6. **The flow, checked against docs/role-state-machine.md and role.ts:** no reopen after shipping; a sendback goes to the builder; the reviewer, not a checker, sends a brief back; the backlog belongs to the system; the sentinel's last move is merge and ship. Every draft follows this.
7. **A finished build hands off as needing a person** where the builder says so; the merge call is then the owner's.

## Drafts

### Draft A

Headline: Bring the idea. Agents ship it, and the calls that matter stay yours.

Share card title: Bring the idea. Agents ship it, and the calls that matter stay yours.
Share card description: Follow one idea from a chat to shipped work. Agents plan, build, check and ship it, and stop for you at each decision only you can make.

Note for the builder: product names in the Five stages section link to each product's page on this site.

#### Hero

### Bring the idea. Agents ship it, and the calls that matter stay yours.

It starts as a thought you type into a chat. Say it is a saved basket for your shop, so customers can come back to what they picked. A small team of agents turns that thought into a plan, builds it, checks it and ships it. At each decision only you can make, the work stops and waits for you.

#### Filmstrip

##### Scene 1. Explore and confirm

You open a chat with the Muse and tell it about the saved basket. The Muse asks questions until the idea looks whole, then asks you whether it is complete. Say no, and you keep talking. Say yes, and only then does it become a ticket.

##### Scene 2. Shape the ticket

The Architect picks up your saved basket and turns it into a ticket. The ticket records the details the Architect dug into and a list of what done means. A build cannot start without both.

##### Scene 3. Cold read the brief

A Reviewer reads the brief on its own, with none of your chat behind it. Any question the brief leaves open sends it back to the Architect to fix. When the open question is one only you can answer, the Architect brings it to you.

##### Scene 4. Parallel builds

Your saved basket gets a Builder of its own, in its own copy of the code, beside builders on other tickets. Before it starts, the files it plans to touch are compared with theirs. When two builds clash, the lower priority one pauses until the other lands, then picks up from the new code. On the computer they share, TaskSlash holds each build and test in a queue until there is room for it.

##### Scene 5. Skeptical review

Before the change goes up for merging, Reviewers read it and presume every changed line is wrong. They read and never edit. The Builder fixes each finding or answers it, and the review goes another round. Only when no finding is left open does the Builder open a pull request, the proposed change to the live code.

##### Scene 6. Visual and automated checks

The project's checks run in order and stop at the first one that fails. PixelSlash shows what changed on screen between the old pages and the new ones, and you go through the changes with a few keys: a to accept, r to reject. FlakeSlash names the tests that pass and fail on the same code. UISlash components take no custom styling, and a check fails any pull request that breaks its rules.

##### Scene 7. Inbox, gate and ship

The Builder hands off and stops. It never merges its own work. Its note lands in the Sentinel's inbox with the notes of every other builder on the team, read oldest first. The Sentinel checks each claim for itself. Red checks, an unmet item on the done list or a claim it cannot reproduce go back to the Builder. When the change clashes with newer work, the Sentinel brings it up to date itself. When every answer is yes, it merges, deploys and closes the ticket.

##### Scene 8. Live rollout

Your saved basket is shipped. The agents stop here. If you want some customers to see a feature before others, ToggleSlash lets you turn it on for a share of users and off again while your app runs, from its dashboard or its command line. That step is yours.

##### Scene 9. Good night retro

The day ends, and you see what shipped today, your saved basket with it.

#### Meet the team

**Muse.** Talks your idea through with you and asks whether it is complete before anything is ticketed.

**Architect.** One per team. Turns your idea into a ticket that says what done means, then starts each build.

**Builder.** One per ticket, in its own copy of the code. Builds the change, runs its checks, opens the pull request and hands off. It never merges.

**Reviewer.** Reads the brief before the build and the change after it, presumes every changed line is wrong, and never edits.

**Sentinel.** One per team. Reads every builder's handoff from one inbox, checks the work for itself, then merges and ships it. A team with no Sentinel has its Architect do this.

#### Where you stay in control

The agents do the shaping, building and checking. These are the moments the work stops for you.

- **The idea.** You say whether it is complete. Nothing is ticketed for building before your yes.
- **A planning question.** When the Architect hits a question only you can decide, it asks you and waits.
- **A builder that needs you.** A Builder missing a decision or access stops and asks for it. A Builder that marks its change as needing your eyes, for feel, wording or anything visual, waits while you judge it, then hands it on or makes the change you ask for.
- **The merge call.** A taste call, a check someone wants to skip, or merging past a known flaky test goes to you before anything merges.
- **What changed on screen.** You accept or reject each change in PixelSlash. A review you have not done yet does not hold up the handoff. A failed one stops it.
- **Anything sent outside.** Nothing goes to anyone outside without you.

On the dashboard, the Machine page draws the whole flow, tags every step that needs a person, and counts how many are waiting on one.

#### Five stages

**Idea.** You and the Muse talk the thought through until you call it complete. Behind it: [OmniSlash], which keeps track of tickets, projects and the agents that work on them.

**Plan.** The Architect shapes the ticket and a Reviewer reads the brief cold. Behind it: [OmniSlash].

**Build.** Builders work side by side, each in its own copy of the code. Behind it: [TaskSlash], which stops builds and tests that start at the same time from overloading one computer, and [UISlash], screen parts and themes a site is built from as they are, with no styling of its own.

**Ship.** The checks run, you review what changed on screen, and the Sentinel merges and deploys. Behind it: [PixelSlash], which shows what changed on a web page between two versions and lets a person accept or reject each change, and [FlakeSlash], which finds the tests that pass and fail on the same code.

**Done.** The ticket closes. If you then want to let a feature out to a share of users first, there is [ToggleSlash], a feature flag service you run yourself that decides which users see which version of a feature.

#### Running today and next

Every product here is alpha. It runs today, and any of it may change.

**Today**

- **OmniSlash**, alpha. A command line tool that runs from a checkout of its public source, with a dashboard whose Machine page places every live ticket on the flow.
- **TaskSlash**, alpha, version 0.1.0. Runs on Linux. There is no installable release yet; you build it from source.
- **PixelSlash**, alpha, version 0.8. Installs from npm. The review app is hosted at pixelslash.dev, or you run it yourself.
- **UISlash**, alpha, every package at version 0.x. Installs from npm, with its docs at hack-cove.com/ui.
- **FlakeSlash**, alpha, version 0.1.0. Its dashboard is hosted at flakeslash.slashslash.build. The command line tool runs from a checkout.
- **ToggleSlash**, alpha, version 0.2.0. You run the server yourself. There is no public hosted service.

**Next**

These are planned, with no dates.

- **OmniSlash:** a team server where each person has their own access.
- **TaskSlash:** scheduling across a pool of machines, and for the automated checks that run on each change.
- **ToggleSlash:** rollouts that raise the share of users in automatic steps, and user accounts and roles so a team stops sharing one admin token.
- **FlakeSlash:** one check on each pull request that links to its dashboard and never blocks.

#### Close

### Bring the idea. Agents ship it, and the calls that matter stay yours.

Your saved basket started as a sentence in a chat. Your next idea starts the same way.

Button: Meet the products


### Draft B

Headline: Your idea becomes shipped work, and every call stays yours.

Share card: Your idea becomes shipped work, and every call stays yours. Agents shape it, build it, check it and ship it. Every product is alpha.

#### Hero

### Your idea becomes shipped work, and every call stays yours.

You bring the idea. A team of agents shapes it, builds it, checks it and ships it.

It stops for you at each decision only you can make.

#### Filmstrip

##### Scene 1: Explore

The muse talks the idea through with you. Nothing moves until you say it is complete.

##### Scene 2: Shape

The architect writes the ticket and what done means. No build starts without both.

##### Scene 3: Cold read

A reviewer reads the brief with fresh eyes. Any gap goes back to the architect.

##### Scene 4: Build

Builders work side by side, each in its own copy of the code. TaskSlash holds each build and test until the computer has room.

##### Scene 5: Doubt

Reviewers assume every changed line is wrong. The pull request opens only when no finding is left open.

##### Scene 6: Check

PixelSlash shows what changed on screen. A person accepts or rejects it.

FlakeSlash finds tests that pass and fail on the same code.

UISlash components take no custom styling, so they cannot be styled wrong.

##### Scene 7: Gate and ship

One sentinel reads every builder's handoff, oldest first. It checks each pull request, sends back what fails, then merges and ships.

##### Scene 8: Release

With ToggleSlash, you turn a feature on for a share of users, and off again, while the app runs.

##### Scene 9: Good night

At the end of the day, you see what shipped.

#### Meet the team

**Muse.** Explores the idea with you and hands it over once you confirm it.

**Architect.** Turns the idea into a ticket that says what done means, then sends it to a builder.

**Builder.** One per ticket, in its own copy of the code. Builds it and opens the pull request. Never merges its own work.

**Reviewer.** Reads the brief, then the changes, and assumes every line is wrong until shown right. Changes nothing.

**Sentinel.** Checks every pull request, sends back what fails, merges what passes and ships it.

#### Where you stay in control

The work stops and waits for you when:

- the muse asks if the idea is complete;
- the architect has a planning question only you can answer;
- a builder needs a decision or access it does not have;
- a builder marks a change as needing your eyes, for feel, wording or anything visual;
- the sentinel meets a taste call, a waived check or a known flaky test;
- PixelSlash shows a change on screen to accept or reject.

Nothing is sent outside without your yes.

#### Five stages

**Idea.** You and the muse explore it until you confirm it. [OmniSlash](omnislash page)

**Plan.** The architect shapes the ticket. A reviewer reads it cold. [OmniSlash](omnislash page)

**Build.** Builders work in their own copies of the code, on components that cannot be styled wrong, while the computer stays within its limits. [OmniSlash](omnislash page) · [UISlash](uislash page) · [TaskSlash](taskslash page)

**Ship.** Reviewers doubt every line. Screens are compared, flaky tests named, and the sentinel merges and ships. [PixelSlash](pixelslash page) · [FlakeSlash](flakeslash page) · [OmniSlash](omnislash page)

**Done.** The ticket closes. When you want to release a feature to some users first, ToggleSlash is yours to run. [ToggleSlash](toggleslash page)

#### Running today and next

Every product is in alpha. Anything may change between versions.

##### Today

**OmniSlash.** Tracks tickets, projects and the agents on them. Refuses to start a build on a ticket that does not say what done means.

**TaskSlash.** Holds each build and test in a queue until your computer has room for it. Built from source for now.

**PixelSlash.** Shows what changed on a page between two versions. A person accepts or rejects each change in the review app.

**FlakeSlash.** Reads your GitHub Actions history and reports the tests that failed and passed on the same code.

**UISlash.** React components and seven themes, built with settings alone, never custom styling.

**ToggleSlash.** Feature flags you run yourself. Change who sees what while the app runs.

##### Next

**OmniSlash.** A team server, with access for each person.

**TaskSlash.** Scheduling across several machines, and for CI.

**ToggleSlash.** Rollouts that raise the share of users in steps on their own. Accounts and roles, so a team stops sharing one key.

**FlakeSlash.** A check on each pull request that links to the dashboard and never blocks.

#### Close

### Your idea becomes shipped work, and every call stays yours.

[See the products](products page)


### Draft C

Headline: You bring the idea and make the calls. Agents build and ship the work.

Share card: You bring the idea and make the calls. Agents build and ship the work. See each step, who does it and where you decide.

#### Hero

### You bring the idea and make the calls. Agents build and ship the work.

You talk an idea through. A team of agents turns it into a ticket, builds it, checks it and ships it. The work stops and waits for you at every decision that is yours to make.

#### Filmstrip

##### Scene 1. Explore and confirm

The muse talks the idea through with you and asks questions until the thought looks whole. Then it asks you if the idea is complete. Nothing becomes a ticket until you say yes.

##### Scene 2. Shape the ticket

The architect turns your idea into a ticket. The ticket says what to build and lists what done means, item by item. A ticket without that list cannot go to a builder.

##### Scene 3. Read the brief cold

A reviewer reads the brief with no other context, the way a stranger would. Any gap it finds goes back to the architect to fix. The build starts only after the check says go.

##### Scene 4. Build side by side

Several builders work at once. Each one has its own copy of the code. When two builders change the same file, the one with the lower priority pauses until the other is done. TaskSlash holds each build and test in a queue until your computer has room for it, so running many at once does not overload it.

##### Scene 5. Challenge every change

Before the builder opens a pull request, reviewers read its changes and assume every changed line is wrong. The builder fixes each finding or answers it. The pull request opens only when no finding is left open.

##### Scene 6. Check the screen and the tests

PixelSlash shows what changed on screen, and you accept or reject each change. FlakeSlash finds the tests that passed and failed on the same code. UISlash components take no custom styling, so a builder cannot style them wrong. Every repo runs its own list of checks in order and stops at the first one that fails.

##### Scene 7. Gate and ship

The sentinel reads one inbox for every builder, oldest first. It checks each pull request. If a check fails, or a done item is missing, or it cannot confirm a claim, it sends the work back to the builder. When every answer is yes, it merges the work, deploys it and closes the ticket.

##### Scene 8. Roll out a feature

With ToggleSlash you turn a feature on for a share of your users, and off again, while the app runs. You make that change from a dashboard or a command line.

##### Scene 9. Good night

At the end of the day you see what shipped.

#### Meet the team

**Muse.** Talks your idea through with you and hands it to the architect once you confirm it.

**Architect.** Turns ideas into tickets, says what done means and sends each ticket to a builder.

**Builder.** Takes one ticket, builds it in its own copy of the code and opens a pull request. A builder never merges its own work.

**Reviewer.** Reads the brief for gaps, then reads the builder's changes and assumes each line is wrong. Reviewers only read. They change nothing.

**Sentinel.** Checks every pull request, sends work back when it falls short, then merges, deploys and closes the ticket.

#### Where you stay in control

The agents stop and wait for you at these points:

- **Your idea is complete.** Nothing is ticketed for building until you say so.
- **A planning question only you can answer.** The architect asks, and the ticket waits for your answer.
- **A builder needs something.** When a decision or access is missing, the builder stops and asks you.
- **A change needs your eye.** When a builder marks its work as needing a person, for how it feels, how it reads or how it looks, you judge it. You hand it on or ask for a change.
- **The merge call.** A judgement of taste, a skipped check or a known flaky test comes to you before anything merges.
- **What changed on screen.** You accept or reject each screen change in PixelSlash.
- **Anything sent outside.** No message leaves for anyone outside until you confirm it.

#### Five stages

**Idea.** You and the muse explore the idea until you confirm it. OmniSlash keeps track of it from here. [OmniSlash]

**Plan.** The architect writes the ticket and the reviewer checks the brief. OmniSlash refuses to start a build without a list of what done means and a go from the check. [OmniSlash]

**Build.** Builders work in their own copies of the code. TaskSlash queues their builds and tests so the computer keeps up. UISlash gives them components they cannot style wrong. [TaskSlash] [UISlash]

**Ship.** The sentinel checks each pull request, merges it and deploys it. PixelSlash shows you what changed on screen. FlakeSlash finds the tests you cannot trust. [PixelSlash] [FlakeSlash]

**Done.** The ticket is closed. When you want a feature to reach some of your users first, you turn it on for them in ToggleSlash. [ToggleSlash]

#### Running today and next

Every product is in alpha. Anything may change between versions.

**Running today**

- **OmniSlash** tracks tickets, projects and the agents that work on them. It refuses a build without a list of what done means, gives each builder its own copy of the code, and sends finished work to the sentinel's inbox. Builders run as threads in T3 Code.
- **TaskSlash** queues builds and tests on one Linux computer and starts each one when there is room. You build it from source.
- **PixelSlash** compares two versions of a page and shows what changed. Its review app, at pixelslash.dev, lets a person accept or reject each change, and your checks can wait for that decision.
- **FlakeSlash** reads your GitHub Actions history and reports a test as flaky when it failed and passed on the same commit. A hosted dashboard ranks what it finds.
- **UISlash** is a set of React components and seven themes on npm. No component takes custom styling.
- **ToggleSlash** is a feature flag service you run yourself. You target users and roll out by percentage from its dashboard or command line.

**Next**

- **OmniSlash:** a team server, with access for each user.
- **TaskSlash:** scheduling across a pool of computers, and for CI.
- **ToggleSlash:** rollouts that raise the percentage in steps on their own, and user accounts with roles.
- **FlakeSlash:** one check on each pull request that links to the dashboard and never blocks.

#### Close

### You bring the idea and make the calls. Agents build and ship the work.

[See what each product does]



## Persona knockout

## Persona knockout: slashslash.build how it works page

### Method

* Candidates: three drafts under neutral letters, A, B and C, read as given. Nothing about which model wrote them or which one anyone prefers was used.
* Readers: the five personas in `personas.json` (Priya, Marcus, Sam, Dana, Leo), each judging from their own profile, focus and review questions, exactly as written.
* The user base question came first in every match: "Is this page for someone like you, and would you be reading it?" Each persona answered it before voting, and the answer framed what they looked for.
* Every pair was played in both orders (first order: the earlier letter shown first; second order: swapped). Each persona named a winner in each order, with one or two reasons.
* Scoring follows `tournament-method.md`: a persona's vote counts 1 for a draft when both orders agree, and 0.5 each when they split. Most points wins the match. Overall standing is the sum of match points.
* Weaknesses, stated plainly: all 30 votes come from one model playing five personas, in one session that had read all three drafts, so the votes are more correlated than five separate readers would be. The review questions are about a rendered page (dark mode, contrast, keyboard, commands); these are copy drafts, so each question was answered as far as the words allow, and that is said where it applies.

### The user base question

| Persona | Answer | How it framed the vote |
| --- | --- | --- |
| Priya | Yes. This is the page a developer would send her to explain what the suite does. She reads the first two screens on her phone and may stop there. | Weighs the hero and the first scenes most; jargon there costs a draft the vote. |
| Marcus | Partly. His pages are the PixelSlash ones; this is the rest of the suite, which he wants visible but optional. | Looks for mechanism, real detail and PixelSlash described as the tool he already knows. |
| Sam | Partly. He comes in from a tool page and reads this to decide whether the suite is worth self hosting. | Looks for what is free to run, how heavy setup is, and today kept apart from planned. |
| Dana | Partly. She reads it to see what she would be buying into beyond visual testing. | Looks for the release stage stated without hype and admissions of what is missing. |
| Leo | Yes. He checks every page. | Judges what the copy promises about keyboard use and readability at 200% zoom; contrast and motion cannot be judged from words. |

No persona lists this page among their own pages, so none of the five is its core reader. Priya and Leo come closest. Counting their votes double would not change any match result below.

### Every match and vote

Each cell is the winner in the first order / the winner in the second order. "split" means the orders disagreed and each draft got 0.5.

| Match | Pair | Priya | Marcus | Sam | Dana | Leo | Score | Winner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | A v B | A / A | A / A | A / A | A / A | A / B (split) | 4.5 to 0.5 | **A** |
| M2 | A v C | A / C (split) | A / A | A / A | A / A | C / A (split) | 4 to 1 | **A** |
| M3 | B v C | B / C (split) | C / C | C / C | B / C (split) | C / C | 1 to 4 | **C** |

### Each persona's reasons

#### M1: A v B

**Priya**
* First order, A: the hero gives her something to repeat to her CEO, "Say it is a saved basket for your shop", in her words and not CI words. B's hero is short but abstract.
* Second order, A: B's second screen is already "brief", "build and test" and "pull request"; A's first two scenes are a chat and a ticket, which she can follow.

**Marcus**
* First order, A: A shows the mechanism, the file overlap compare before a build, checks that stop at the first failure, and "a to accept, r to reject" in PixelSlash.
* Second order, A: B's "so they cannot be styled wrong" is the marketing gloss he leaves over. A gives PixelSlash a version, npm and a self run option, so it still reads as his tool.

**Sam**
* First order, A: A says how heavy each tool is to get going: "There is no installable release yet; you build it from source", "You run the server yourself".
* Second order, A: both keep today and next apart, but only A says the planned work has no dates. Neither draft states the licence or gives a try it command.

**Dana**
* First order, A: per product stage and version ("alpha, version 0.8") means no hunting; "There is no public hosted service" is the kind of admission she trusts.
* Second order, A: B puts "Every product is alpha" on its share card, which she credits, but A is more honest about what is missing.

**Leo**
* First order, A: A names the keys for the PixelSlash review, which tells him the review is built for the keyboard.
* Second order, B: read after A, B's short blocks and one line scenes reflow far better at 200% zoom; A's long paragraphs make a lot of scrolling.

#### M2: A v C

**Priya**
* First order, A: the saved basket running through every scene is the story she would retell.
* Second order, C: read after A, C's headline is the cleaner one sentence pitch, "You bring the idea and make the calls. Agents build and ship the work.", and its first screen is shorter at 390px.

**Marcus**
* First order, A: A says what happens when two builds clash and that the Sentinel reproduces each claim; C says less about what runs where.
* Second order, A: C has one line he likes, "your checks can wait for that decision", but A's keys, versions and hosted or self run choice carry more real detail.

**Sam**
* First order, A: setup weight is spelled out per tool, down to "The command line tool runs from a checkout."
* Second order, A: C describes what each tool does well, but A tells him what it costs him to run, which is what he came for.

**Dana**
* First order, A: stage and version per product, and "These are planned, with no dates" is the line that keeps the roadmap from reading as a promise.
* Second order, A: C states alpha once and then reads as fully available; A keeps the stage beside every product.

**Leo**
* First order, C: C's paragraphs are shorter and its control list has bold labels that scan well when zoomed.
* Second order, A: A's "a to accept, r to reject" and the Machine page that "tags every step that needs a person" show a site practising what it sells.

#### M3: B v C

**Priya**
* First order, B: B's hero fits on one phone screen with nothing she has to look up.
* Second order, C: C says what she gets and where she decides in plainer full sentences; B's "Doubt" and "Cold read" scene titles read like insider words.

**Marcus**
* First order, C: C gives real mechanism, "reads your GitHub Actions history", "failed and passed on the same commit", "your checks can wait for that decision".
* Second order, C: B is the gloss draft; nothing in it tells him how PixelSlash fits his CI.

**Sam**
* First order, C: C says plainly what he runs himself, "a feature flag service you run yourself", and that TaskSlash runs on one Linux computer.
* Second order, C: both keep today and next apart, but B's tool lines read more like a sales page.

**Dana**
* First order, B: B's share card states "Every product is alpha" before she even lands, the stage with no hunting at all.
* Second order, C: C is more candid inside the page about what each tool actually does today, which matters more once she is reading.

**Leo**
* First order, C: C's scene headings say what happens ("Check the screen and the tests"), so jumping by heading still makes sense; B's one word headings do not.
* Second order, C: C's control list is labelled point by point, easier to follow at 200% zoom than B's run on list of clauses.

### Tally

| Draft | M1 | M2 | M3 | Total (of 10) | Matches won |
| --- | --- | --- | --- | --- | --- |
| A | 4.5 | 4 | | **8.5** | 2 |
| C | | 1 | 4 | **5** | 1 |
| B | 0.5 | | 1 | **1.5** | 0 |

No tie arose, so no tie break was needed.

### Result

**Winner: Draft A.** It won both its matches. Its running example (the saved basket) gives Priya a story to repeat, its mechanism and product detail satisfy Marcus and Sam, and its per product stage and admissions satisfy Dana. Its weakness is length: Priya and Leo both pulled toward the shorter drafts when they read A first.

**Runner up: Draft C.** It beat B clearly and took points from A only on its headline and its shorter paragraphs.

Gaps no draft closes, from the personas' own questions: none states a licence (Sam), none gives a command or try it line (Marcus, Sam), and none says whether paid hosting is planned (Dana).

### Lines a final edit could borrow

From Draft C:
* Headline: "You bring the idea and make the calls. Agents build and ship the work." The clearest one sentence pitch (Priya). Could serve as A's share card title or a hero subline.
* Share card description: "See each step, who does it and where you decide."
* Scene 3: "A reviewer reads the brief with no other context, the way a stranger would." Plainer than A's "with none of your chat behind it".
* Scene 3: "The build starts only after the check says go."
* Scene 4: "TaskSlash holds each build and test in a queue until your computer has room for it, so running many at once does not overload it."
* Today, PixelSlash: "Its review app, at pixelslash.dev, lets a person accept or reject each change, and your checks can wait for that decision." (Marcus)
* Today, FlakeSlash: "reads your GitHub Actions history and reports a test as flaky when it failed and passed on the same commit. A hosted dashboard ranks what it finds." (Marcus, Sam)
* Today, ToggleSlash: "You target users and roll out by percentage from its dashboard or command line."
* Five stages, Ship: "FlakeSlash finds the tests you cannot trust." The plainest description of FlakeSlash in any draft (Priya).
* Control list: "No message leaves for anyone outside until you confirm it."
* Close button: "See what each product does". A clearer next step than "Meet the products" (Priya).

From Draft B:
* Share card: "Every product is alpha." The stage on the share card itself, where Dana sees it first; A's share card leaves it out.
* Today, OmniSlash: "Refuses to start a build on a ticket that does not say what done means." A's OmniSlash line says how it runs but not what it does.
* Scene 5: "Reviewers assume every changed line is wrong. The pull request opens only when no finding is left open." A tighter form of A's scene 5.
* Reviewer: "assumes every line is wrong until shown right. Changes nothing."
* Control list close: "Nothing is sent outside without your yes."


Letters to briefs, revealed after the vote: Draft A is brief 2 (warm and story led), Draft B is brief 3 (terse and confident), Draft C is brief 1 (plain and direct).


## Style briefs

- **Brief 1, plain and direct.** Short sentences, second person, say what happens and who does it. No metaphor.
- **Brief 2, warm and story led.** Follow one idea from your head to shipped, as a short story told in the present tense. Still concrete, still facts only.
- **Brief 3, terse and confident.** Fewest words that carry the fact. Captions as short as a sign. Calm, no hype.

Every brief also says: no claim beyond the facts, no em or en dashes and no hyphen used as one, none of the banned names, one headline used three times, and none of the AI tells listed in the copy process. The drafts were assigned letters at random; which brief made which draft is recorded in the knockout section after the vote.
