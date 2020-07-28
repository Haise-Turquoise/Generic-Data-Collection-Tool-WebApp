export default class COATreeEntity {
  constructor({ _id, parentId, COAGroupId, COAIds, sheetNameId }) {
    this._id = _id;
    this.parentId = parentId;
    this.COAGroupId = COAGroupId;
    this.COAIds = COAIds;
    this.sheetNameId = sheetNameId;
  }
}
