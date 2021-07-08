import { ObjectId } from "mongodb";
import { StatusDoc } from "../../types/status";

export default class StatusEntity {
  public _id: ObjectId;
  public name: string;
  public description: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;
  public forPackage: boolean;
  public order: number;
  
  constructor({ _id, name, description, timestamp, updatedBy, isActive, forPackage, order }: StatusDoc) {
    this._id = _id;
    this.name = name;
    this.description = description;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
    this.forPackage = forPackage;
    this.order = order;
  }
}
