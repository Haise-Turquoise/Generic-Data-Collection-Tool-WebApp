import Submission from "../repositories/Submission";


export default class submissionValidation {
    

    constructor(){}

    findAttirbuteCol(rows: any,id:string | undefined){
        var search_row = rows[0].cells;
    
        for(var key in search_row){
          if(search_row[key].text != undefined && search_row[key].text === id){
            return key;
          }
        }
    }
     
    
    findColrow(rows: any,id:string | undefined){
        for(var key in rows){
          if(rows[key].cells[0].text != undefined && rows[key].cells[0].text === id){
            return key
          }
        }
    
        return null;
    }

    validateAll(sub: any){
        //
        
        console.log("HIJ_IHIHIHIHIIHIHIHIHIHIHIHIHIHIHIHIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        for(var sheetNum in sub.workbookData){
            this.validateSheet(sub.workbookData[sheetNum])
        }

    }


    validateSheet(sheet: any){
        //console.log(sheet);
        let validate_row = sheet.rows[1].cells;

        for(var key in validate_row){

            if(validate_row[key].text != undefined){
                console.log("CELL " + key)
                let p1 = validate_row[key].text.split(';'); //array with multiplevalidations
                const r = /\[(.*?)\] (\w+) \[(.*?)\] in \[(.*?)\]/;
                p1.forEach((valString: string) =>{    
                    let res = valString.match(r);
                    if(res != null){
                        let cat_list = res[1].split(',')
                        let op = res[2]
                        let val_list = res[3]
                        let sheet_name = res[4]
                        console.log(res)
                        this.applyValidations(cat_list,op,val_list,Number(key), sheet_name);
                    }      
                })
            }
        }
    }



    applyValidations(cat_list: any,operator:string,val: any,ci: any,sheet_name:string){
        
        let vdata = {}
        let value; let type;
        if(operator === 'be' || operator === 'nbe'){
            value = val.split(' and ');
            type = (isNaN(value[0]) || isNaN(value[1])) ? 'attribute' : 'number';
        }
        else if(operator === 'req'){
            value = '';
            type = 'required';
        }
        else{
            value = val;
            type = isNaN(value) ? 'attribute' : 'number';
        }

        vdata = {type,vInfo:{operator,value,sheet_name}}
        

        cat_list.forEach((cat : string) => {
            if(cat.length > 0){console.log("applying validations to %s with info " , cat); this.validate(ci,cat,vdata)}
        })
        
    }


    validate(ci: any,cat: any,vData: any){  
    //     let {type,vInfo} = vData;
    //     let y = ci;
        
    //     let x = Number(this.findCategoryRow(cat,this.datas));
        
    //     if(isNaN(x) || isNaN(y)){return;}

    //     if(type === 'number'){
    //         let t = this.datas.getCell(x,y);
    //         if(t.text != undefined) {
                
    //             if(!this.validateNumber(t.text,vInfo)){  
    //                 console.log('error number set for %d &d', x,y);
    //                 this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`);
    //                 let sheet = this.spread.getSheet()
    //                 if(sheet){sheet.notes.addNote(x,y,`cell value must be ${vInfo.operator} ${vInfo.value}` + '\n'); }
    //             }
    //             // else{
    //             //     this.errors.delete(`${x}_${y}`);
    //             //     let sheet = this.spread.getSheet()
    //             //     if(sheet){sheet.notes.clearNote(x,y);}
    //             // }
    //         }
    //     }
    //     else if(type === 'attribute'){
    //         let t = this.datas.getCell(x,y);
           
    //         if(t.text != undefined) {
    //             console.log("hitting ", x,y);
    //             if(!this.validateAttribute(t.text,vInfo,x,cat)){ 
    //                 console.log('error set for %d &d', x,y);
    //                 this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
    //                 let sheet = this.spread.getSheet()
    //                 if(sheet){sheet.notes.addNote(x,y,`cell value must be ${vInfo.operator} ${vInfo.value}` + '\n'); console.log("note sett for %d %d", x , y)}
    //             }
    //             // else{
    //             //     this.errors.delete(`${x}_${y}`);
    //             //     let sheet = this.spread.getSheet()
    //             //     if(sheet){sheet.notes.clearNote(x,y);}
                    
                    
    //             // }
    //         }
    //     }
    //     else if(type === 'required'){

    //         let t = this.datas.getCell(x,y);
    //         if(t) {
    //             if(t.text === undefined || t.text === ''){
    //                 this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
    //                 let sheet = this.spread.getSheet()
    //                 if(sheet){sheet.notes.addNote(x,y,`cell must contain a value` + '\n'); console.log("Note SETTT");}
    //             }
    //             // else{
    //             //     this.errors.delete(`${x}_${y}`);
    //             //     let sheet = this.spread.getSheet()
    //             //     if(sheet){sheet.notes.clearNote(x,y);}
    //             // }
    //         }
        
    //     }

    }
}