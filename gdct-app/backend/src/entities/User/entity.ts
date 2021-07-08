import { ObjectId } from "mongodb";
import { UserDoc } from "../../types/user";

export default class UserEntity {
  public _id: ObjectId;
  public username: string;
  public email: string;
  public title: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public password: string;
  public sysRole: UserDoc["sysRole"];
  public toBeApproved: any[];
  public isActive: boolean;
  public isEmailVerified: boolean;
  public creationDate: Date;
  public approvedDate: Date;
  public ext: string;
  public timestamp: Date;
  public updatedBy: string;
  public newPermissionPending: boolean;
  public pendingPermissions: any[];
  public tempSysRole: [];

  constructor({
    _id,
    username,
    email,
    title,
    firstName,
    lastName,
    phoneNumber,
    password,
    sysRole,
    toBeApproved,
    isActive,
    isEmailVerified,
    creationDate,
    approvedDate,
    ext,
    timestamp,
    updatedBy,
    newPermissionPending,
    pendingPermissions,
    tempSysRole,
  }: UserDoc) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.sysRole = sysRole;
    this.toBeApproved = toBeApproved;
    this.isActive = isActive;
    this.isEmailVerified = isEmailVerified;
    this.creationDate = creationDate;
    this.approvedDate = approvedDate;
    this.ext = ext;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.newPermissionPending = newPermissionPending;
    this.pendingPermissions = pendingPermissions;
    this.tempSysRole = tempSysRole;
  }
}
