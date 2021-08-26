import { Document } from 'mongoose';

export default interface ReportingPeriod {
  name: string;
  startDate: Date;
  endDate: Date;
  application: string;
  code: string;
  submissionClosed: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface ReportingPeriodDoc extends ReportingPeriod, Document {}
