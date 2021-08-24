export default interface ReportingPeriod {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  code: string;
  submissionClosed: boolean;
  updatedAt: string;
  updatedBy: string;
  __v?: number;
}
