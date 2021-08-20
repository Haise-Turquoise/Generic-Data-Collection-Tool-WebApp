import React from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { MenuProps } from '../../../../types/spreadsheetTypes/insertMenuTypes';

// @ts-ignore
import { generateAttributeMap } from '../../../../tools/misc'; 


// This component is responsible for attribute insertion menu
// Created by Sheldon Su on 2021/04/02
class varianceInsertionMenu extends React.Component<MenuProps>{
  callback: Function;
  getSheet: any;
  data: {textPair:string, IdPair:string}[];
  constructor(props:MenuProps){
    super(props);
    this.state = {open:false};
    this.insert = this.insert.bind(this);
    this.generateSelection = this.generateSelection.bind(this);
    this.callback = this.props.callback;
    this.getSheet = this.props.getSheet;
    this.data = [];
  }

  // Generate all the selection pairs
  generateSelection(){
    const sheet = this.getSheet();
    const attributeMap:any = generateAttributeMap(sheet);
    const attributeIDs = Object.keys(attributeMap);
    const attributeList = []

    // organize ID with text
    for (const Id of attributeIDs){
      const colNum = attributeMap[Id];
      const cell = sheet.rows[9].cells[colNum];
      const text = cell.text;
      attributeList.push({text, Id});
    }

    // Generate pairs with for loop
    for (let i = 0; i < attributeList.length; i++){
      for (let j = i + 1; j < attributeList.length; j++){
        const textPair = attributeList[i].text + ' - ' + attributeList[j].text;
        const IdPair = attributeList[i].Id + ' ' + attributeList[j].Id;
        this.data.push({textPair, IdPair});
      }
    }
  }
  
  // Function that calls the insert function and pass the selected value for insert
  insert(){

      let input_fields = document.getElementById('VarianceGroup');
      // @ts-ignore
      if (input_fields.selectedIndex){
          // @ts-ignore
          let id = input_fields[input_fields.selectedIndex].id;
          this.callback(id);
      }
      this.setState({open:false});
      this.data = [];
  }

  render(){
      return(
          <div>
              <Button variant="outlined" color="primary" onClick={()=>{this.generateSelection(); this.setState({open:true})}}>
                  Insert Variance
              </Button>
              <Dialog onClose={()=>{this.setState({open:false}); this.data=[];}} aria-labelledby="simple-dialog-title" open={// @ts-ignore
                this.state.open} fullWidth={true}>
                  <DialogTitle id="simple-dialog-title">Insert Variance</DialogTitle>
                  <form>
                      <label id="Variance">Please select a variance Pair:</label>
                      <select name="property_name" id="VarianceGroup">
                          <option>Please select a pair</option>
                          {this.data.map(element=><option id={element.IdPair}>{element.textPair}</option>)}
                      </select>
                  </form>
                  <button onClick={this.insert}>Confirm</button>
              </Dialog>
          </div>
      )
  }
}

export default varianceInsertionMenu;