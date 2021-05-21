import React, {Component} from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import spreadSheetController from '../../../../controllers/spreadSheet'
import Button from '@material-ui/core/Button';

class populationSelectionMenu extends Component{
  constructor(props) {
    super(props);
    this.callBack = this.props.callback;
    this.notifySelection = this.notifySelection.bind(this);
    this.orgList = [];
    this.state = {open:false};
  }

  componentDidMount(){
    spreadSheetController.fetchOrg().then(data=>this.orgList = data.orgs);
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
        <Dialog onClose={()=>{this.setState({open:false})}} aria-labelledby="simple-dialog-title" open={this.state.open} fullWidth={true}>
          <DialogTitle id="simple-dialog-title">Select a organization</DialogTitle>
          <form>
            <label>Please select an organization:</label>
            <select id="orgs">
              <option>Please select an organization</option>
              {this.orgList.map(element => {
                const text = `(${element.id}) ` + element.name;
                const id = element.id;
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
