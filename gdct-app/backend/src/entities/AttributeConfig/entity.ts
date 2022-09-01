import { ObjectId } from "mongodb";
import { AttributeConfigDoc } from "../../types/attributeconfig";

export default class AttributeConfigEntity {
  public _id: ObjectId;
  public attributeKeyword: string;
  public code: string;
  public updatedBy: string;
  public updatedAt: string;
  
  constructor({ _id, attributeKeyword, code, updatedBy, updatedAt }: AttributeConfigDoc) {
    this._id = _id;
    this.attributeKeyword = attributeKeyword;
    this.code = code;
    this.updatedBy = updatedBy;
    this.updatedAt = updatedAt;
  }
}
  