export interface PreviewData{
  COAID:string;
  attributeId:string;
  currentSheetIndex:number;
}

export interface Coordinate{
  row:number;
  col:number;
}

export interface SpreadSheetProps{
  templateID:string;
  name:string;
}

export interface CategorySelection{
  [index:string]:[string, string];
}

export interface IdMapping{
  [Id:string]:number
}