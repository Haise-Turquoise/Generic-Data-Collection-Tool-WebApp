import { ObjectId } from "mongodb";
import { CategoryTreeDoc } from "../../types/categorytree";

export default class COATreeEntity {
  public _id: ObjectId;
  public parentId: ObjectId;
  public categoryGroupId: ObjectId;
  public categoryId: ObjectId[];
  public sheetNameId: ObjectId;
  public timestamp: Date;
  public updatedBy: string;
  
  constructor({ _id, parentId, categoryGroupId, categoryId, sheetNameId, timestamp, updatedBy, }: CategoryTreeDoc) {
    // console.log(categoryGroupId)
    // console.log(_id)
    this._id = _id;
    this.parentId = parentId;
    this.categoryGroupId = categoryGroupId;
    this.categoryId = categoryId;
    this.sheetNameId = sheetNameId;
    this.timestamp = timestamp;
    this.updatedBy = updatedBy;
  }
}
