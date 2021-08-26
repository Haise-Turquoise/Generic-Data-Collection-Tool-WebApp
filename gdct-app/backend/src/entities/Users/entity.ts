import { ObjectId } from "mongodb";
import { UserDoc } from "../../types/user";

export default class UsersEntity {
  public _id: ObjectId;
  public username: string;
  public email: string;
  public title: string;
  public firstName: string;
  public lastName: string;
  public phoneNumber: string;
  public sysRole: UserDoc["sysRole"];
  public toBeApproved: any[];
  public isActive: boolean;
  public isEmailVerified: boolean;
  public creationDate: Date;
  public approvedDate: Date;
  public ext: string;
  public updatedAt: Date;
  public updatedBy: string;
  public pendingPermissions: any[];

  constructor({
    _id,
    username,
    email,
    title,
    firstName,
    lastName,
    phoneNumber,
    isActive,
    isEmailVerified,
    sysRole,
    creationDate,
    approvedDate,
    ext,
    updatedAt,
    updatedBy,
    pendingPermissions,
    toBeApproved,
  }: UserDoc) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.isActive = isActive;
    this.isEmailVerified = isEmailVerified;
    this.sysRole = sysRole;
    this.creationDate = creationDate;
    this.approvedDate = approvedDate;
    this.ext = ext;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.pendingPermissions = pendingPermissions;
    this.toBeApproved = toBeApproved;
  }
}
