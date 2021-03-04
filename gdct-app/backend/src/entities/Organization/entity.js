export default class OrgEntity {
  constructor({
    _id,
    id,
    IFISNum,
    code,
    name,
    legalName,
    address,
    province,
    city,
    postalCode,
    location,
    organizationGroupId,
    active,
    managerUserIds,
    contactUserId,
    authorizedUserId,
    programId,
    effectiveDate,
    expiryDate,
    timestamp,
    updatedBy,
  } = {}) {
    this._id = _id;
    this.id = id;
    this.IFISNum = IFISNum;
    this.code = code;
    this.name = name;
    this.legalName = legalName;
    this.address = address;
    this.province = province;
    this.city = city;
    this.postalCode = postalCode;
    this.location = location;
    this.organizationGroupId = organizationGroupId;
    this.active = active;
    this.managerUserIds = managerUserIds;
    this.contactUserId = contactUserId;
    this.authorizedUserId = authorizedUserId;
    this.programId = programId;
    this.effectiveDate = effectiveDate;
    this.expiryDate = expiryDate;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
