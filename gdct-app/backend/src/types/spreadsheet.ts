import Category from './category'
export default interface CategoryAndAttributeTransferObject {
  Categories:any[], 
  Attributes:AttributeDataObject[]
}

export interface AttributeDataObject{
  name:string,
  id:string,
}

export interface CategoryDataObject{
  categoryGroup: string,
  categories: Category[], 
  sheetName: string,
  childCategory: CategoryDataObject[]
}