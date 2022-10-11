import CategoryTree from "./categorytree";

export default interface DetectEmptyTree {
  _id: string,
  name: string,
  updatedAt?: string,
  updatedBy?: string,
  value: CategoryTree[]
}