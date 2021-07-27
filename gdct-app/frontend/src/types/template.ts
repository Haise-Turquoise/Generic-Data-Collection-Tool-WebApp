export default interface Template {
  _id: string,
  templateData?: SheetData[],
  name: string,
  templateTypeId: string,
  workflowProcessId: string,
  updatedBy: string,
  timestamp: string,
  createdAt: string,
  updatedAt: string,
  __v?: number,
};

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
  [rowIndex:string]:{cells?:SheetDataCells, height:number},
};

export interface SheetDataConditionalFormatting{
  functionName:string,
  params:any[],
}

export interface SheetDataCols{
  [index:string]:{width: number}
}

export interface SheetDataCells{
  [index:string]:SheetDataCell,
};

export interface SheetDataCell{
  text?: string,
  style?: number,
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
