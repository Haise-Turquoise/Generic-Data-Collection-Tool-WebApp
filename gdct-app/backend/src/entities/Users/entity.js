export default class UserEntity {
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
  }
}
