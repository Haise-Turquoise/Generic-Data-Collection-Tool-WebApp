import { Document } from 'mongoose';

export default interface ReportingPeriod {
  name: any;
  startDate: any;
  endDate: any;
  application: string;
  code: string;
  submissionClosed: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface ReportingPeriodDoc extends ReportingPeriod, Document {}
