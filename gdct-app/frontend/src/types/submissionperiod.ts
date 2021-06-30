export default interface SubmissionPeriod {
  _id: string,
  reportingPeriodId: string,
  programId: string[],
  startDate: string,
  endDate: string,
  name: string,
  timestamp: string,
  updatedBy: string,
}