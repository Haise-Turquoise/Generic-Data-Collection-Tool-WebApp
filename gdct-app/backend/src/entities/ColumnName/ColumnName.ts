import { ObjectId } from "mongodb";
import { AttributeDoc } from "../../types/attribute";

export default class ColumnName {
  public _id: ObjectId;
  public id: string;
  public name: string;
  public timestamp: Date;
  public updatedBy: string;

  constructor({ _id, id, name, timestamp, updatedBy }: AttributeDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
