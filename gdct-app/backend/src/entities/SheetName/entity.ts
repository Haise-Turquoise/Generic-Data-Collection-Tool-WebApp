import { ObjectId } from "mongodb";
import { SheetNameDoc } from "../../types/sheetname";

export default class SheetNameEntity {
  public _id: ObjectId;
  public id: number;
  public name: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({
    _id,
    id,
    name,
    timestamp,
    updatedBy,
    isActive,
  }: SheetNameDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
