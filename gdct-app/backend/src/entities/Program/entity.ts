import { ObjectId } from "mongodb";
import { ProgramDoc } from "../../types/program";

export default class ProgramEntity {
  public _id: ObjectId;
  public id: Number;
  public name: string;
  public code: string;
  public updatedAt: Date;
  public updatedBy: string;
  public isActive: boolean;

  constructor({ _id, id, name, code, updatedAt, updatedBy, isActive }: ProgramDoc) {
    this._id = _id;
    this.id = id;
    this.name = name;
    this.code = code;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.isActive = isActive;
  }
}
