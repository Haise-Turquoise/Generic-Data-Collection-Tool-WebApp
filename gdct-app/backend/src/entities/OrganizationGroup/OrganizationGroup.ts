import { ObjectId } from "mongodb";
import { OrganizationGroupDoc } from "../../types/organizationgroup";

export default class OrgGroupEntity {
  public _id: ObjectId;
  public id: string;
  public name: string;
  public isActive: boolean;

  constructor({ _id, id, name, isActive }: OrganizationGroupDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.isActive = isActive;
  }
}
