import React from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import spreadSheetController from '../../controllers/spreadSheet'

class attributeInsertionMenu extends React.Component{
    constructor(props){
        super(props);
        this.Attributes = {};
        this.state = {update:false, open:false};
        this.updateAttributes = this.updateAttributes.bind(this);
        this.insert = this.insert.bind(this);
        this.callback = this.props.callback;
        this.data = []
    }

    componentDidMount(){
        spreadSheetController.fetchCategoryAndAttribute().then(data=>this.data = data['Attributes']);
    }

    
    updateAttributes(attributeGroup) {
        let property_name = document.getElementById('AttributeGroup');
        this.Attributes = attributeGroup;
        attributeGroup.forEach((input)=>{ 
            let option = document.createElement("OPTION");
            let text = input["name"]
            let value = input['id']
            option.setAttribute("id", value)
            let textnode = document.createTextNode(text);
            option.appendChild(textnode);
            property_name.appendChild(option);
        });
    }
      
    insert(){
        let input_fields = document.getElementById('AttributeGroup');
        if (input_fields.selectedIndex){
            let text = input_fields[input_fields.selectedIndex].text;
            let id = input_fields[input_fields.selectedIndex].id;
            this.callback(id, text);
        }
        this.setState({open:false})
    }

    render(){
        return(
            <div>
                <Button variant="outlined" color="primary" onClick={()=>{this.setState({open:true})}}>
                    Insert Attributes
                </Button>
                <Dialog onClose={()=>{this.setState({open:false})}} aria-labelledby="simple-dialog-title" open={this.state.open} fullWidth={true}>
                    <DialogTitle id="simple-dialog-title">Insert Attributes</DialogTitle>
                    <form>
                        <label id="Attributies">Please select an Attribute:</label>
                        <select name="property_name" id="AttributeGroup">
                            <option>Please select a Attribute</option>
                            {this.data.map(element=><option id={element.id}>{element.name}</option>)}
                        </select>
                    </form>
                    <button onClick={this.insert}>Confirm</button>
                </Dialog>
            </div>
        )
    }
}

export default attributeInsertionMenu;