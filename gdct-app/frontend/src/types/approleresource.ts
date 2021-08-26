export default interface AppRoleResource {
  _id: string,
  resourceId: { id: string, resourceName: string }[],
  // conflicting info for this one - needs to be fixed
  appSysRoleId: { roleId: string, roleName: string } | string,
  updatedBy: string,
  updatedAt: string,
  __v?: number,
}