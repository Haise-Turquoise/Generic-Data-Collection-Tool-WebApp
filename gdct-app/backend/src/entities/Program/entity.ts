import { ObjectId } from "mongodb";
import { ProgramDoc } from "../../types/program";

export default class ProgramEntity {
  public _id: ObjectId;
  public name: string;
  public code: string;
  public timestamp: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, name, code, timestamp, updatedBy, isActive }: ProgramDoc) {
    this._id = _id;
    this.name = name;
    this.code = code;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
