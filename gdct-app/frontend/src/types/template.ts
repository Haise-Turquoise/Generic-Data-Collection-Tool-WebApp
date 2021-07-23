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

interface SheetData{
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
