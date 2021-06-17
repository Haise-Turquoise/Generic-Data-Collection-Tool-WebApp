export default interface TemplatePackage {
  _id: string,
  templateIds: string[],
  programIds: string[],
  name: string,
  submissionPeriodId: string,
  statusId: string,
  creationDate: string,
  updatedBy: string,
  timestamp: string,
  __v?: number,
  userCreatorId?: null
}