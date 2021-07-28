import CategoryGroup from "./categorygroup";

export default interface CategoryTree {
  _id?: string,
  categoryId: string[],
  // sometimes get group instead of string
  categoryGroupId: string | CategoryGroup,
  sheetNameId: string,
  timestamp?: string,
  updatedBy?: string,
  parentId?: string,
  __v?: number,
}