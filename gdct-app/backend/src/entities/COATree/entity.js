export default class COATreeEntity {
  constructor({ _id, parentId, categoryGroupId, categoryId, sheetNameId, timestamp, updatedBy, }) {
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
