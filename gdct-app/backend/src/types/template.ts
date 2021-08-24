import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export default interface Template {
  name: string;
  workflowId: ObjectId;
  workflowProcessId: ObjectId;
  templateData: SheetData[];
  templateTypeId: ObjectId;
  userCreatorId: ObjectId;
  creationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
  statusId: ObjectId;
  googleSheetId: ObjectId;
  timestamp: Date;
  updatedBy: string;
}

export interface SheetData{
  name: string,
  freeze: string,
  styles: SheetDataStyle[],
  merges: string[],
  rows: SheetDataRows,
  cols: SheetDataCols,
  validations: any[]
  autofilter: any,
  ConditionFormatter: SheetDataConditionalFormatting[]
};

export interface SheetDataRows{
  [index:string]:{cells?:SheetDataCells, hide?:boolean},
};

export interface SheetDataConditionalFormatting{
  functionName:string,
  params:any[],
}

export interface SheetDataCols{
  [index:string]:{width?: number, hide?:boolean}
}

export interface SheetDataCells{
  [index:string]:SheetDataCell,
};

export interface SheetDataCell{
  text?: string,
  style?: number,
  editable?:boolean
  formulaValue?: number,
}

export interface SheetDataStyle{
  align?: string,
  bgcolor?: string,
  font?: SheetDataStyleFont,
  border?: SheetDataBorder,
  textwrap?: boolean
};

export interface SheetDataStyleFont{
  size: number,
  name:string,
  family: number,
};

export interface SheetDataBorder{
  bottom?:[string, string],
  top?:[string, string],
  left?:[string, string],
  right?:[string, string],
};


export interface TemplateDoc extends Template, Document {}
