export default class COATreeEntity {
  constructor({ _id, parentId, categoryGroupId, categoryId, sheetNameId }) {
    this._id = _id;
    this.parentId = parentId;
    this.categoryGroupId = categoryGroupId;
    this.categoryId = categoryId;
    this.sheetNameId = sheetNameId;
  }
}
