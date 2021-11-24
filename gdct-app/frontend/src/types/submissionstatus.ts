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
    submissionClosed: boolean;
  }
}