import CategoryTree from "./categorytree";

export default interface DetectEmptyTree {
  _id: string,
  name: string,
  timestamp?: string,
  updatedBy?: string,
  value: CategoryTree[]
}