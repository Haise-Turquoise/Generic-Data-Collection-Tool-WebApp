import { ObjectId } from "mongodb";
import { OrganizationGroupDoc } from "../../types/organizationgroup";

export default class OrgGroupEntity {
  public _id: ObjectId;
  public id: number;
  public name: string;
  public isActive: boolean;
  public updatedAt: string;
  public updatedBy: string;
  public createdBy: string;

  constructor({ _id, id, name, isActive, updatedAt, updatedBy, createdBy }: OrganizationGroupDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.createdBy = createdBy;
  }
}
