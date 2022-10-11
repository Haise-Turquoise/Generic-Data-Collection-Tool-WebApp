export default interface AuditLog {
  _id?: string,
  user: { _id: string, email: string },
  activity: string,
  moduleName: string,
  recordId: string | null | undefined,
  oldValue: {[key: string]: any},
  newValue: {[key: string]: any},
  updatedAt?: string,
  __v?: number,
}