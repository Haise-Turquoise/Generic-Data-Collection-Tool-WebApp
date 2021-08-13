export default interface AppSysRole {
  _id: string,
  appSys: string,
  role: string,
  isActive: boolean,
  timestamp: string,
  isSuperRole?: boolean,
  updatedBy?: string,
  __v?: number,
}