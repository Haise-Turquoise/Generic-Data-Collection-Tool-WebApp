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


    // validateNumber(n,v){
    //     let {operator, value } = v;
        
    //     let pinput = parseInt(n);
        
    //     console.log("pinput " + pinput + " pvalue " + value + " ??? " + operator);
    //     switch(operator){
    //         case 'gt':
    //             return pinput > parseInt(value);
    //         case 'lt':
    //             return pinput < parseInt(value);
    //         case 'gte':
    //             return pinput >= parseInt(value);
    //         case 'lte':
    //             return pinput <= parseInt(value);
    //         case 'eq':
    //             return pinput == parseInt(value);
    //         case 'neq':
    //             return pinput != parseInt(value);
    //         case 'be':
    //             return pinput > parseInt(value[0]) && pinput < parseInt(value[1]);
    //         case 'nbe':
    //             return pinput < parseInt(value[0]) || pinput > parseInt(value[1]);
    //     }
    // }




    // validateAttribute(n,v,ri,cat){
    //     let {operator, value,sheet_name } = v;
        
    //     let pinput = Number(n);


    //     if(operator === 'be' || operator === 'nbe'){

    //         let attrcol = this.datas.findInputColOnRow(9,value[0]);
    //         let attrcol2 = this.datas.findInputColOnRow(9,value[1]);

    //         if(attrcol === undefined || attrcol2 === undefined){return true;}
            
    //         let attrtext = this.datas.getCell(ri,Number(attrcol));
    //         let attrtext2 = this.datas.getCell(ri,Number(attrcol2));

    //         if(attrtext.text === undefined|| attrtext2.text === undefined){ return true;}

            

    //         switch(operator){
    //             case 'be':
    //                 return pinput > parseInt(attrtext.text) && pinput < parseInt(attrtext2.text);
    //             case 'nbe':
    //                 return pinput < parseInt(attrtext.text) || pinput > parseInt(attrtext2.text);
    //         }

    //     }else{
    //         let sheetData = this.spread.findDataSheetbyName(sheet_name);
    //         let attrcol = this.findAttrCol(value,sheet_name)//this.datas.findInputColOnRow(9,value);
    //         let colrow = this.findCategoryRow(cat,this.spread.findDataSheetbyName(sheet_name))
    //         if(attrcol === undefined || colrow === null ){return true; console.log("cant find")}
    //         console.log("NINJA WE MADE IT !!!!!")
    //         let attrtext = sheetData.getCell(colrow,Number(attrcol));
    //         console.log("hiii " + attrtext.text)
    //         if(attrtext.text === undefined){ return true;}

    //         switch(operator){
    //             case 'gt':
    //                 return pinput > Number(attrtext.text);
    //             case 'lt':
    //                 return pinput < Number(attrtext.text);
    //             case 'gte':
    //                 return pinput >= Number(attrtext.text);
    //             case 'lte':
    //                 return pinput <= Number(attrtext.text);
    //             case 'eq':
    //                 return pinput == Number(attrtext.text);
    //             case 'neq':
    //                 return pinput != Number(attrtext.text);
    //         }
    //     }

    //     return true;


    // }

}