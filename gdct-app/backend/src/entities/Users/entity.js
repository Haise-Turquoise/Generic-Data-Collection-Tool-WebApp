export default class UsersEntity {
  constructor({
    _id,
    username,
    email,
    title,
    firstName,
    lastName,
    phoneNumber,
    organizations,
    isActive,
    isEmailVerified,
    isApproved,
    sysRole,
    creationDate,
    approvedDate,
    ext,
    timestamp,
    updatedBy,
    pendingPermissions,
    toBeApproved,
  }) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.organizations = organizations;
    this.isActive = isActive;
    this.isEmailVerified = isEmailVerified;
    this.isApproved = isApproved;
    this.sysRole = sysRole;
    this.creationDate = creationDate;
    this.approvedDate = approvedDate;
    this.ext = ext;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.pendingPermissions = pendingPermissions;
    this.toBeApproved = toBeApproved;

  }
}
