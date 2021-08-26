import { ObjectId } from "mongodb";
import { CategoryGroupDoc } from "../../types/categorygroup";

export default class COAGroupEntity {
  public _id: ObjectId;
  public name: string;
  public code: string;
  public updatedAt: Date;
  public updatedBy: string;
  public isActive: boolean;
  
  constructor({ _id, name, code, updatedAt, updatedBy, isActive }: CategoryGroupDoc) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
