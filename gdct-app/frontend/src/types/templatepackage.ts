import Program from "./program";
import Status from "./status";
import SubmissionPeriod from "./submissionperiod";
import Template from "./template";

export default interface TemplatePackage {
  _id: string,
  templateIds: string[],
  programIds: string[],
  name: string,
  submissionPeriodId: string,
  statusId: string,
  creationDate: string,
  updatedBy: string,
  updatedAt: string,
  __v?: number,
  userCreatorId?: null
}

export interface TemplatePackagePopulated {
  _id: string,
  templateIds: Template[],
  programIds: Program[],
  name: string,
  submissionPeriodId: SubmissionPeriod,
  statusId: Status,
  creationDate: string,
  updatedBy: string,
  updatedAt: string,
  __v?: number,
  userCreatorId?: null,
}