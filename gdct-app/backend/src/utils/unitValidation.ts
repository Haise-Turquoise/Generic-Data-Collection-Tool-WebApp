

export default class submissionValidation {
    errors = new Map();
    sheet: any;

    constructor(sheet: any){
        this.sheet = sheet;
        
    }


    findAttirbuteCol(rows: any,id:string | undefined){
        var search_row = rows[9].cells;
    
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


    // validate_row(ri,uci ,row,unitInfo){

    //     let numCols = this.datas.cols.len;

    //     let errorcells = "";

    //     for(var i = uci+1; i<numCols;i++){

    //         if(this.isAttributeColumn(i) && row[i] != undefined){
                
    //             let checkText = row[i].text;
                
    //             if(checkText != undefined && !checkText.match(new RegExp(unitInfo.pattern)) ){
    //                 console.log("pattern: " + unitInfo.pattern + " text: " + checkText)
    //                 console.log(checkText.match(new RegExp(unitInfo.pattern)))
    //                 console.log("errors %d %d", ri, i)
    //                 errorcells += xy2expr(i,ri) +',';
    //             }
    //         }

    //         console.log("hello")
    //     }

    //     if(errorcells == ""){
    //         this.errors.delete(`${ri}_${uci}`)
    //         let sheet = this.spread.getSheet()
    //         if(sheet){sheet.notes.clearNote(ri,uci);}
    //     }else{
    //         this.errors.set(`${ri}_${uci}`,unitInfo.note)
    //         let sheet = this.spread.getSheet()
    //         if(sheet){sheet.notes.setNote(ri,uci,'For ' + errorcells+ unitInfo.note);}
    //     }

        

    // }
}