# Generic Data Collection Tool (GDCT) — web app prototype

Ontario Ministry of Health prototype for collecting and approving reporting data: React / Redux / TypeScript front end, Node / Express / MongoDB back end. Team repository, 2019–2023, 41 branches; intern and staff developers each worked on a `branchOf<Name>` branch and merged into `submaster` through pull requests on Azure DevOps.

I worked on it as a full-stack co-op developer from September 2022 to April 2023. This README is my navigation layer for readers; the original project README (setup instructions) is kept unchanged below the line.

## Where my work is

- 48 commits on `branchOfJim` (2022-11-01 to 2023-04-11), 74 files touched, 12 pull requests merged into `submaster`.
- Core files: `gdct-app/frontend/src/views/OrganizationRouter/ModifyOrganization/ModifyOrganization.tsx`, `gdct-app/frontend/src/views/TemplateRouter/Template/Template.tsx`, `gdct-app/backend/src/controllers/OrganizationGroup/controller.ts`, `gdct-app/backend/src/services/OrganizationGroup/service.ts`, `gdct-app/frontend/src/controllers/organizationGroup.ts`, `gdct-app/frontend/src/tools/misc.ts`.
- The 16-month approval bug: `gdct-app/backend/src/controllers/User/controller.ts`, PR 602 (2022-11-01).
- My handover documents are in `docs/` (see the list at the end).

## Concrete batches to open

| PR | Date | Commits behind it | What | Where |
|---|---|---|---|---|
| 602 | 2022-11-01 | 2 | Approval page failing silently after 16 months in production: Express routes never ended the request-response cycle on the success path; fixed the pattern on all five affected endpoints | `backend/src/controllers/User/controller.ts` |
| 667 | 2023-01-12 | 9 over ten weeks, 20 files | Organization-group dropdown on the organization form: form, Redux state and API routes | `ModifyOrganization.tsx`, `controllers/organizationGroup.ts`, `OrganizationGroup/*` |
| 724 | 2023-02-13 | 1 | Excel template import: newline parse error in exceljs | `tools/misc.ts` |
| 736 | 2023-02-28 | 3 | Confirmation prompt for phase actions on the template page | `Template.tsx` |
| 750 | 2023-03-07 | 9, four of them debugging | Read-only "peek workflow" chart in Template Design | `Template.tsx`, `TemplateType/*` (backend controller, service, repository) |
| 771 | 2023-03-23 | 6 | Global table filter and calendar box across the data tables | `views/AppConfigs`, `views/AuditLog`, `views/COARouter/*`, `MasterValuePopulation.tsx` and others |

### PR 602, the hard one
- Symptom: the approve button needed two or three clicks, then a blank page; no error, no log, no stack trace.
- My first commit in this repository is the fix itself, eight weeks after I joined; the weeks before it were spent tracing.
- Method: five async paths eliminated one node at a time, from the React component through the Redux thunk to two Express routes, with a per-node status log kept locally.
- Cause: the success path of those routes never ended the request-response cycle; pending requests piled up until the browser's per-host connection limit blocked everything.
- Fix: all five routes sharing the pattern, not just the two that had been triggered; the 12-line note in `User/controller.ts` explains the mechanism against the Express specification.
- The same pattern showed up in newly added code in January; isolated on `branchOfJimRight` on 2023-01-23 and fixed the same day.

## How I worked in this repository

### My path for every batch
- Local `branchOfJim` with its own database (`DCT_Jim`), so trial runs never touched shared data.
- Push to the Azure branch, run its pipeline, test it myself, then hand it to the project manager to test.
- Only after PM sign-off: pull request into `submaster`, a second pipeline run, a second PM pass.
- Same feature checked twice: on my branch build before the PR, on the shared build after it. If something broke the next day, the diff showed which merge did it, mine or someone else's.
- The procedure is written up in `docs/Knowledge transfer document Yuanhao(Jim) Liu.docx` ("Normal 2-way merge procedure").

### What the shared branch looked like without that path
- Some intern batches went from a personal branch straight into `submaster`.
- Result in the same period: eight revert pull requests (seven on 2022-11-28) and one revert of 5,214 lines.
- The same files landed on `submaster` three or four times within three weeks.
- Record: the `*-revert-from-*` branches, `branchOfWentao`, `BranchOfYufei`.

### What my path produced
- Twelve merges into `submaster` over eight months; none was reverted, none pulled anyone else's work back.
- Zero direct commits to `submaster`; every landing went through a pull request.
- Before larger PRs I merged `submaster` back into my branch first (PRs 601, 739, 746), so conflicts were mine to solve, not the team's.
- The organization-group integration touched form, Redux state and API across four PRs without breaking neighbouring areas.

### Where my trial and error lived
- Nine commits and twenty files over ten weeks on `branchOfJim` before one pull request (#667). Feature PRs carried five to nine commits from my branch; fixes carried one to three.
- Four debugging commits on 2023-03-02/03 for the read-only workflow chart, then one clean PR (#750).
- A two-way-merge test on 2023-02-17 that I reverted the same day on my own branch and re-applied four days later (#728–730, 41 lines); `submaster` never saw it.
- A second lane, `branchOfJimRight` (Jan–Feb 2023), kept experiments apart from team syncs: isolating the second memory-leak instance, validation drafts with backup variants. Only the accepted pieces were redone on `branchOfJim` and merged (PR 724).

## Branch map for readers

- `branchOfJim`: my working branch and the most complete tree; default branch of this repository.
- `submaster`: the shared integration branch during my term. `master` was last touched in 2020.
- `branchOf<Name>`: one container per developer, the team convention.
- `*-revert-from-*`: reverts of shared-branch merges, kept as they were.
- Tags `v0.x`: releases from before my term. History ends 2023-04-11, the end of my term.

## docs/

- `Knowledge transfer document Yuanhao(Jim) Liu.docx` — handover guide: feature timeline, debugging guide (blank page, hook leaks, environment, database connection), 8-step code review, 2-way merge procedure, Azure pipeline notes.
- `knowledge presentation-Jim Liu.docx` — handover presentation.
- `Range Date Picker task note.docx` — on-demand vs full-load trade-off for the 58,500-record audit log, written for PM review.
- `Backend AppError WorkProcessId not found issue23-3-10.docx` — reproduction and remediation notes for a database-integrity error.

Snapshot notes: this is the repository as it stood at the end of my term. Keys and test accounts in the source belong to a retired prototype environment. Commit authors are shown as they were.

---

# MOHLTC Data Web App Prototype

## Setup

### Local Setup

#### Database

You must have MongoDB set up locally. Install [here](https://www.mongodb.com/download-center/community).

#### Package Manager

Currently, the script commands are only set for [yarn](https://yarnpkg.com/lang/en/) (not npm).

#### Installing Dependencies

On the terminal, Run the command `yarn`. This will install slate, the application root, frontend, and backend dependencies..

#### Starting the Application

The backend is set to port 3000 and the frontend is set to port 3003. If you have any conflicts in port, adjust the ports in the [backend](/gdct-app/backend/app.js) or [frontend](/gdct-app/frontend/webpack.dev.js).

Run the command `yarn start`. Both the frontend and backend will be started. Open the application on your browser [here](http://localhost:3003).

##### Account Email verification

A test email from ```Ethereal``` is used to accept all incoming email messages.

Login with ```email: julio32@ethereal.email``` and ```password: qdjK2XgTyyHtR9zScz``` [here](https://ethereal.email/login).

## Testing

[Jest](https://jestjs.io/docs/en/tutorial-react)

