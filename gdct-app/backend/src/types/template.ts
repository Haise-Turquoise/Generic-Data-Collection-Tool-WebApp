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
  rows: SheetDataRows[],
  cols: SheetDataCols[],
  validations: any[]
  autofilter: any,
  ConditionFormatter: SheetDataConditionalFormatting[]
};

interface SheetDataRows{
  [index:string]:{cells?:SheetDataCells},
};

interface SheetDataConditionalFormatting{
  functionName:string,
  params:any[],
}

interface SheetDataCols{
  [index:string]:{width: number}
}

interface SheetDataCells{
  [index:string]:SheetDataCell,
};

interface SheetDataCell{
  text?: string,
  style?: number,
  formulaValue?: number,
}

interface SheetDataStyle{
  align?: string,
  bgcolor?: string,
  font?: SheetDataStyleFont,
  border?: SheetDataBorder,
  textwrap?: boolean
};

interface SheetDataStyleFont{
  size: number,
  name:string,
  family: number,
};

interface SheetDataBorder{
  bottom?:[string, string],
  top?:[string, string],
  left?:[string, string],
  right?:[string, string],
};


export interface TemplateDoc extends Template, Document {}
