import { ObjectId } from "mongodb";
import { AttributeDoc } from "../../types/attribute";

export default class ColumnName {
  public _id: ObjectId;
  public id: string;
  public name: string;
  public updatedAt: Date;
  public updatedBy: string;

  constructor({ _id, id, name, updatedAt, updatedBy }: AttributeDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
