export interface PreviewData{
  COAID:string;
  attributeId:string;
  currentSheetIndex:number;
}

export interface OrgPreviewData{
  row:number;
  col:number;
  currentSheetIndex:number;
  originalValue:string;
}

export interface Coordinate{
  row:number;
  col:number;
}

export interface SpreadSheetProps{
  templateID:string;
  name:string;
  backButton:Function;
}

export interface CategorySelection{
  [index:string]:[string, string];
}

export interface IdMapping{
  [Id:string]:number,
}