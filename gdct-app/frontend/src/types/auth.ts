import User from "./user"

export type loginParams = {
  email: string,
  password: string,
  selectedRole: string,
}

export type loginRes = {data:{email:string, _id:string, sessionID:string}, status:string} | undefined

export type newTemplateType = {
  appSys: string,
  applierEmail: string,
  approve: boolean,
  input: boolean,
  organization: {
    authorizedPerson: {
      name: string,
      email: string,
    },
    id: number,
    name: string,
  },
  permission: string,
  program: {
    name: string,
    code: string,
    _id: string,
  },
  review: boolean,
  status: string,
  submission: {
    name: string,
    _id: string,
  },
  submit: boolean,
  view: boolean,
  viewCognos: boolean,
}

export type registerParams = {
  IsActive: boolean,
  email: string,
  endDate: Date,
  ext: string,
  firstName: string,
  hashedUsername: string,
  lastName: string,
  newTemplates: newTemplateType[],
  password: string,
  phoneNumber: string,
  startDate: Date,
  sysRole: {
    appSys: string,
    role: string,
    org: {
      orgId: number,
      program: {
        programCode: string,
        programId: string,
        template: {
          templateTypeId: string,
          templateCode: string,
        }[],
      }[],
    }
  }[],
  title: string,
  username: string,
  //TODO need help understanding why this -- see userrolemanagement
  sysRoles?: string[],
}

export type authRes = {
  status: string,
  data: User,
  error: any,
}