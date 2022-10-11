import Submission from "../repositories/Submission";
import unitValidation from "./unitValidation";
import UnitModel from "../models/UnitOfMeasurement/UnitOfMeasurement";

export default class submissionValidation {
    errors = new Map();
    sheet: any;
    unitValidation: any;

    constructor(sheet: any){
        this.sheet = sheet;
        this.unitValidation = new unitValidation(sheet);
        
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

    async validateAll(sub: any){
        //
        
        
        for(var sheetNum in sub.workbookData){
            await this.unitValidation.validateSheet(sub.workbookData[sheetNum]);
            this.validateSheet(sub.workbookData[sheetNum]);
        }

        return this.unitValidation.errors;

    }

    async findandValidatesheet(sub: any,sheetName: string){

        for(var sheetNum in sub.workbookData){
            if(sub.workbookData[sheetNum].name == sheetName){
                await this.unitValidation.validateSheet(sub.workbookData[sheetNum]);
                this.validateSheet(sub.workbookData[sheetNum]);
                return this.unitValidation.errors;
            }
            
        }

        return null;
    }


    validateSheet(sheet: any){
        //console.log(sheet);
        let validate_row = sheet.rows[1].cells;

        for(var key in validate_row){

            if(validate_row[key].text != undefined){
                //console.log("CELL " + key)
                let p1 = validate_row[key].text.split(';'); //array with multiplevalidations
                const r = /\[(.*?)\] (\w+) \[(.*?)\] in \[(.*?)\]/;
                p1.forEach((valString: string) =>{    
                    let res = valString.match(r);
                    if(res != null){
                        let cat_list = res[1].split(',')
                        let op = res[2]
                        let val_list = res[3]
                        let sheet_name = res[4]
                        
                        this.applyValidations(cat_list,op,val_list,Number(key), sheet_name,sheet.rows);
                    }      
                })
            }
        }
    }



    applyValidations(cat_list: any,operator:string,val: any,ci: any,sheet_name:string, rows:any){
        
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
            if(cat.length > 0){this.validate(ci,cat,vdata, rows)}
        })
        
    }


    validate(ci: any,cat: any,vData: any, rows: any){  
        let {type,vInfo} = vData;
        let y = ci;
       // console.log(rows);
        let x = Number(this.findColrow(rows,cat));

        
        
        if(isNaN(x) || isNaN(y)){return;}

        if(type === 'number'){
            
            let t = this.getCell(x,y,rows);
            
            if(t != undefined && t.text != undefined) {
                
                if(!this.validateNumber(t.text,vInfo)){  
                    //console.log('error number set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`);
                 
                }
            }
        }
        else if(type === 'attribute'){
            let t = this.getCell(x,y,rows);
           
            if(t.text != undefined) {
                
                if(!this.validateAttribute(t.text,vInfo,x,cat,rows)){ 
                    //console.log('error set for %d &d', x,y);
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                   
                }
  
            }
        }
        else if(type === 'required'){

            let t = this.getCell(x,y,rows);
            if(t) {
                if(t.text === undefined || t.text === ''){
                    this.errors.set(`${x}_${y}`, `incorrect type, expected ${vInfo.operator} ${vInfo.value}`)
                   
                }
    
            }
        
        }

    }


    validateNumber(n:any,v:any){
        let {operator, value } = v;
        
        let pinput = parseInt(n);
        
        //console.log("pinput " + pinput + " pvalue " + value + " ??? " + operator);
        switch(operator){
            case 'gt':
                return pinput > parseInt(value);
            case 'lt':
                return pinput < parseInt(value);
            case 'gte':
                return pinput >= parseInt(value);
            case 'lte':
                return pinput <= parseInt(value);
            case 'eq':
                return pinput == parseInt(value);
            case 'neq':
                return pinput != parseInt(value);
            case 'be':
                return pinput > parseInt(value[0]) && pinput < parseInt(value[1]);
            case 'nbe':
                return pinput < parseInt(value[0]) || pinput > parseInt(value[1]);
        }
    }




    validateAttribute(n: any,v: any,ri:any ,cat: any ,rows: any){
        let {operator, value,sheet_name } = v;

        console.log(v);
        
        let pinput = Number(n);


        if(operator === 'be' || operator === 'nbe'){

            let attrcol = this.findAttirbuteCol(rows,value[0]);
            let attrcol2 = this.findAttirbuteCol(rows,value[1]);

            if(attrcol === undefined || attrcol2 === undefined){return true;}
            
            let attrtext = this.getCell(ri,Number(attrcol),rows);
            let attrtext2 = this.getCell(ri,Number(attrcol2),rows);

            if(attrtext.text === undefined|| attrtext2.text === undefined){ return true;}

            

            switch(operator){
                case 'be':
                    return pinput > parseInt(attrtext.text) && pinput < parseInt(attrtext2.text);
                case 'nbe':
                    return pinput < parseInt(attrtext.text) || pinput > parseInt(attrtext2.text);
            }

        }
        else{
            
            let sheetData = this.findDataSheetbyName(sheet_name);
           
           /// console.log("sheetData !!!!!!!!!!!!"); 
            let attrcol = this.findAttirbuteCol(sheetData,value);
            let colrow = this.findColrow(sheetData,cat);

            
            
            if(attrcol === undefined || colrow === null ){return true; console.log("cant find");}
            //console.log("NINJA WE MADE IT !!!!!")
            let attrtext = this.getCell(colrow,Number(attrcol),sheetData);
            
            console.log("hiii " + attrtext)
            if( attrtext === undefined ||  attrtext.text === undefined){ return true;}

            switch(operator){
                case 'gt':
                    return pinput > Number(attrtext.text);
                case 'lt':
                    return pinput < Number(attrtext.text);
                case 'gte':
                    return pinput >= Number(attrtext.text);
                case 'lte':
                    return pinput <= Number(attrtext.text);
                case 'eq':
                    return pinput == Number(attrtext.text);
                case 'neq':
                    return pinput != Number(attrtext.text);
            }
        }

        return true;


    }


    findDataSheetbyName(sheetName: string){
       // console.log(this.sheet.workbookData)
        for(var sheetNum in this.sheet.workbookData){

            if(this.sheet.workbookData[sheetNum].name === sheetName){
                return this.sheet.workbookData[sheetNum].rows
            }

        }
        return undefined;
    }

}