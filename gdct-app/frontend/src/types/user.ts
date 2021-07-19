import SysRole from "./sysrole";

interface UserTemplate {
  templateCode: string,
  _id: string,
  templateTypeId: string,
}

interface UserProg {
  programCode: string,
  _id: string,
  programId: string,
  template: UserTemplate[],
}

interface UserOrg {
  orgId: string,
  orgName: string,
  _id: string,
  program: UserProg[],
  IsActive: boolean,
}

interface UserSysRole extends SysRole {
  org: UserOrg[]
}

export default interface User {
  _id?: string,
  hashedUsername?: string,
  title: string,
  ext?: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  isActive: boolean,
  username: string,
  email: string,
  startDate?: string,
  endDate?: string,
  sysRole: UserSysRole[],
  __v?: number,
  approvedDate: string,
  creationDate: string,
  isEmailVerified: boolean,
  timestamp: string,
  updatedBy?: string,
  AppConfig?: string[],
  password: string,
  IsActive?: boolean,
  facebook?: Object,
  google?: Object,
  updatedAt?: string,
  toBeApproved?: any[] | null,
}

export interface RawData {
  appSys: string,
  creationDate: string,
  email: string,
  firstName: string,
  lastName: string,
  orgId: string,
  orgName: string,
  phoneNumber: string,
  programCode: string,
  programId: string,
  rawKey: string,
  role: string,
  templateCode: string,
  templateTypeId: string,
  username: string,
}
