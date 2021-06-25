import React from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
//@ts-ignore
import spreadSheetController from '../../../../controllers/spreadSheet'
import { MenuProps, AttributeData, AttributeAndCategoryData } from '../../../../types/spreadsheetTypes/insertMenuTypes';

// This component is responsible for attribute insertion menu
// Created by Sheldon Su on 2021/03/01
class attributeInsertionMenu extends React.Component<MenuProps>{
    callback: Function;
    data: AttributeData[];
    constructor(props:MenuProps){
        super(props);
        this.state = {update:false, open:false};
        this.insert = this.insert.bind(this);
        this.callback = this.props.callback;
        this.data = []
    }

    // Retreve information from the server
    componentDidMount(){
        spreadSheetController.fetchCategoryAndAttribute().then((data: AttributeAndCategoryData)=>{
            this.data = data['Attributes'];
            this.data.sort((a, b) => -1 *a.name.localeCompare(b.name));
        });
    }
    
    // Function that calls the insert function and pass the selected value for insert
    insert(){

        let input_fields = document.getElementById('AttributeGroup');
        // @ts-ignore
        if (input_fields.selectedIndex){
            // @ts-ignore
            let text = input_fields[input_fields.selectedIndex].text;
            // @ts-ignore
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
                <Dialog onClose={()=>{this.setState({open:false})}} aria-labelledby="simple-dialog-title" open={//@ts-ignore

                    this.state.open} fullWidth={true}>
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