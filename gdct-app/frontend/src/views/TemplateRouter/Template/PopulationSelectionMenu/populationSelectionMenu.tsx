import React, {Component} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
// @ts-ignore
import spreadSheetController from '../../../../controllers/spreadSheet'
import { MenuProps, OrgsData} from '../../../../types/spreadsheetTypes/insertMenuTypes'
import Button from '@material-ui/core/Button';

class populationSelectionMenu extends Component<MenuProps>{
  callBack: Function;
  orgList: OrgsData[];
  constructor(props:MenuProps) {
    super(props);
    this.callBack = this.props.callback;
    this.notifySelection = this.notifySelection.bind(this);
    this.orgList = [];
    this.state = {open:false};
  }

  componentDidMount(){
    // @ts-ignore
    spreadSheetController.fetchOrg().then((data: {orgs:OrgsData[]})=>{this.orgList = data.orgs; console.log(data)});
  }
   
   notifySelection(){
     let input_fields = document.getElementById('orgs');
      // @ts-ignore
      if (input_fields.selectedIndex){
        // @ts-ignore
        let id = input_fields[input_fields.selectedIndex].id;
        this.callBack(id);
      }
      this.setState({open:false});
   }

  render(){
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={()=>{this.setState({open:true})}}>
          Enable preview
        </Button>
        <Dialog onClose={()=>{this.setState({open:false})}} aria-labelledby="simple-dialog-title" open={//@ts-ignore
          this.state.open} fullWidth={true}>
          <DialogTitle id="simple-dialog-title">Select a organization</DialogTitle>
          <form>
            <label>Please select an organization:</label>
            <select id="orgs">
              <option>Please select an organization</option>
              {this.orgList.map(element => {
                //@ts-ignore
                const text = `(${element.id}) ` + element.name;
                //@ts-ignore
                const id = String(element.id);
                return <option id={id}>{text}</option>
              })}
            </select>
          </form>
          <button onClick={this.notifySelection}>Confirm</button>
        </Dialog>
      
      </div>
    );
  }
}

export default populationSelectionMenu;
