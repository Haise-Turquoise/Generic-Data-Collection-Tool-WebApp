import { ObjectId } from "mongodb";
import { OrganizationDoc } from "../../types/organization";

export default class OrgEntity {
  public _id: ObjectId;
  public id: number;
  public IFISNum: string;
  public code: string;
  public name: string;
  public legalName: string;
  public address: string;
  public province: string;
  public city: string;
  public postalCode: string;
  public location: string[];
  public organizationGroupId: ObjectId[];
  public active: boolean;
  public managerUserIds: ObjectId[];
  public authorizedPerson: {name: string, email: string};
  public programId: ObjectId[];
  public effectiveDate: Date;
  public expiryDate: Date;
  public updatedAt: any;
  public updatedBy: string;

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
    authorizedPerson,
    programId,
    effectiveDate,
    expiryDate,
    updatedAt,
    updatedBy,
  }: OrganizationDoc) {
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
    this.authorizedPerson = authorizedPerson;
    this.programId = programId;
    this.effectiveDate = effectiveDate;
    this.expiryDate = expiryDate;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
