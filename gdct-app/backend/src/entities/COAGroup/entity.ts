import { CategoryGroupDoc } from "../../types/categorygroup";

export default class COAGroupEntity {
  public _id: string;
  public name: string;
  public code: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;
  
  constructor({ _id, name, code, timestamp, updatedBy, isActive }: CategoryGroupDoc) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
