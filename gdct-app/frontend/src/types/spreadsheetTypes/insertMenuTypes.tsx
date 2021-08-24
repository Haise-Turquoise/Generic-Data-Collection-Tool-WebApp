export interface MenuProps{
  callback:Function;
  getSheet?:any;
}

export interface AttributeData{
  id:string;
  name:string;
}

export interface CategoryData{
  COA:string;
  id:string;
  name:string;
  updatedAt:string;
  unitOfMeasure:string;
  __v:number;
  _id:string;

}

export interface CategoryGroupData{
  categories: CategoryData[];
  categoryGroup:string;
  sheetName:string;
  childCategory: CategoryGroupData[];
}

export interface AttributeAndCategoryData{
  Attributes:AttributeData[];
  Categories: CategoryGroupData[];
}

export interface InsertedID{
  [id:string]:HTMLElement
}

export interface OrgsData{
  id:number;
  name:string;
}