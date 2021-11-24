export default interface SubmissionStatus {
  _id: string,
  name: string,
  template: {
    name: string,
  },
  templateType: {
    name: string,
  },
  program: {
    code: string,
    name: string,
  },
  org: {
    id: number,
    name: string,
  },
  submission?: {
    name: string,
  },
  submissionPeriod: {
    name: string,
  },
  status?: {
    name: string,
  },
  subIndex: number | null,
  submissionNote: {
    submissionId: string,
    updatedDate: string,
    updatedBy: string,
  },
  reportingPeriod: {
<<<<<<< HEAD:gdct-app/frontend/src/types/submissionstatus.ts
    submissionClosed: boolean;
=======
    submissionClosed: boolean,
>>>>>>> parent of e784f7ed (Revert "Merged PR 324: refresh"):gdct-app/frontend/src/types/packagestatus.ts
  }
}