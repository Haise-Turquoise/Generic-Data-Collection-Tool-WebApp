import { ObjectId } from "mongodb";
import CategoryTree, { CategoryTreeDoc } from "../../types/categorytree";

export default class COATreeEntity {
  public _id: ObjectId | null;
  public parentId: ObjectId;
  public categoryGroupId: ObjectId;
  public categoryId: String[];
  public sheetNameId: ObjectId;
  public updatedAt: Date;
  public updatedBy: string;
  
  constructor({ _id, parentId, categoryGroupId, categoryId, sheetNameId, updatedAt, updatedBy, }: CategoryTreeDoc | CategoryTree) {
    // console.log(categoryGroupId)
    // console.log(_id)
    this._id = _id;
    this.parentId = parentId;
    this.categoryGroupId = categoryGroupId;
    this.categoryId = categoryId;
    this.sheetNameId = sheetNameId;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
