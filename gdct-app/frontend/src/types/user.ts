import SysRole from "./sysrole";

export interface UserTemplate {
  templateCode: string,
  _id?: string,
  templateTypeId: string,
}

export interface UserProg {
  programCode: string,
  _id?: string,
  programId: string,
  template: UserTemplate[],
}

export interface UserOrg {
  orgId: string,
  orgName: string,
  _id?: string,
  program: UserProg[],
  IsActive: boolean,
}

export interface UserSysRole extends SysRole {
  org: UserOrg[],
  appSysRoleId?: string,
}

export interface ToBeApproved {
  organization: {
    name: string,
    id: string,
    authorizedPerson: {
      name: string,
      email: string,
    },
  },
  program: {
    name: string,
    code: string,
    _id: string,
  },
  submission: {
    name: string,
    _id: string,
  },
  permission: string,
  approve: boolean,
  review: boolean,
  submit: boolean,
  view: boolean,
  viewCognos: boolean,
  input: boolean,
  status: string,
  appSys: string,
  applierEmail: string,
  appSysRoleId: string,
}

interface pendingPermission {
  organization: {
    name: string,
    id: number,
    authorizedPerson: {
      name: string,
      email: string,
    },
  },
  program: {
    name: string,
    code: string,
    _id: string,
  },
  submission: {
    name: string,
    _id: string,
  },
  permission: string,
  approve: boolean,
  review: boolean,
  submit: boolean,
  view: boolean,
  viewCognos: boolean,
  input: boolean,
  status: string,
  appSys: string,
  applierEmail: string,
  appSysRoleId: string,
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
  updatedBy?: string,
  AppConfig?: string[],
  password: string,
  IsActive?: boolean,
  facebook?: Object,
  google?: Object,
  updatedAt?: string,
  toBeApproved?: ToBeApproved[] | null,
  pendingPermissions?: pendingPermission[] | null
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
