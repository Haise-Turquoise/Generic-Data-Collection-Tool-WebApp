import { AnyBulkWriteOperation } from "mongodb";
import UnitOfMeasurementRepository from "../repositories/UnitOfMeasurement"
import { UnitOfMeasurementDoc } from "../types/unitofmeasurement";
export default class unitValidation {
    errors = new Map();
    sheet: any;
    unitOfMeasure: any;
    attributeRow: number;
    unitOfMeasureRules: any;

    constructor(sheet: any){
        this.sheet = sheet;
        this.attributeRow = 9;
        this.unitOfMeasure = new UnitOfMeasurementRepository();
        
    }





    findAttirbuteCol(rows: any,id:string | undefined){
        var search_row = rows[9] ? rows[9] .cells : undefined;
    
        for(var key in search_row){
          if(search_row[key].text != undefined && search_row[key].text === id){
            return key;
          }
        }
    }
    
    getCell(x: any, y: any, rows:any){
        if(rows && rows[x] && rows[x].cells && rows[x].cells[y]){
                return rows[x].cells[y];
        }
        return undefined;
    }
    
    findColrow(rows: any,id:string | undefined){
        for(var key in rows){
          if(rows[key].cells != undefined && rows[key].cells[1] != undefined && rows[key].cells[1].text != undefined && rows[key].cells[1].text === id){
            return key
          }
        }
    
        return null;
    }
    getUnit(info:any,text:string){
      for(let key in info){
          
          if(info[key].unitOfMeasurement === text){
              return info[key]
          }
      }

      return null;
  }

    async validateSheet(sheet: any){
      let sheetData = sheet?.rows;
      this.unitOfMeasureRules = await this.unitOfMeasure.findAll();
      let hasUnit = this.findAttirbuteCol(sheet.rows,"Unit of Measure" );
      let rowlen = Object.keys(sheet.rows).length;
     
      if(!hasUnit){return;}

      for(var i = this.attributeRow+1; i< rowlen;i++){
        let unit = this.getCell(i,Number(hasUnit),sheetData);
        if(unit != undefined && unit.text != undefined){
            let unitInfo = this.getUnit(this.unitOfMeasureRules, unit.text)
            //console.log("pattern " + unitInfo.pattern + " for unit " + unit.text)
            
            if( unitInfo!= null){
                this.validate_row(i,Number(hasUnit),sheet.rows[i],unitInfo,sheetData)
            }
        }
      }



    }

    isAttributeColumn(ci: number, rows: any){
      let attr = this.getCell(this.attributeRow,ci,rows);
      let attrid = this.getCell(0,ci,rows);
      if(attr === null || attr.text === undefined || attrid === null || attrid.text === undefined){return false;}
      if(Number(attrid.text) === undefined){return false;}
      return true;



  }


    validate_row(rowNum: number,uci:number,row:any,unitInfo:UnitOfMeasurementDoc,rows:any){
      let rowData = row.cells;
      let numCols = Object.keys(rowData).length;

      for(var i = uci+1; i<numCols;i++){
        if(this.isAttributeColumn(i,rows) && rowData[i] != undefined ){
          let checkText = rowData[i].text;
          if(checkText != undefined && !checkText.replace(/(\r\n|\n|\r)/gm, "").match(new RegExp(unitInfo.pattern)) ){
              
              console.log("pattern: " + unitInfo.pattern + " text: " + checkText)
              console.log(checkText.match(/^-?\d{1,13}(\.\d{1,5})?$/))
              this.errors.set(`${rowNum}_${i}`, unitInfo.note)
              
             
          }
          // else{
          //   console.log('we gucci')
          // }
        }
      }

    }

    
}