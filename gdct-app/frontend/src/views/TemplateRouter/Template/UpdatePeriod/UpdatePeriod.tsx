import React, { ChangeEvent } from "react";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
//@ts-ignore
import spreadSheetController from '../../../../controllers/spreadSheet'
import { MenuProps, AttributeData, AttributeAndCategoryData } from '../../../../types/spreadsheetTypes/insertMenuTypes';

type props = MenuProps & { getBasePeriod: () => string, runBP: boolean }
interface state {
    update: boolean;
    open: boolean;
    baseYear: string;
    period: string;
}

// This component is responsible for attribute insertion menu
// Created by Sheldon Su on 2021/03/01
class updatePeriodMenu extends React.Component<props, state>{
    callback: Function;
    getBasePeriod: Function;
    constructor(props: props){
        super(props);
        this.state = {update:false, open:false, baseYear: "", period: ""};
        this.callback = this.props.callback;
        this.getBasePeriod = this.props.getBasePeriod;
        this.updatePeriod = this.updatePeriod.bind(this);
        this.runUpdate = this.runUpdate.bind(this);
    }

    componentDidUpdate(prevProps: props, prevState: state) {
        if (prevProps.runBP !== this.props.runBP || this.state.open !== prevState.open) {
            this.setState({ baseYear: this.props.getBasePeriod() })
        }
    }

    updatePeriod(e: ChangeEvent<HTMLInputElement>) {
        this.setState({period: e.target.value || ''})
    }

    runUpdate() {
        const rgx = /^20\d\d-\d\d ?(Q1|Q2|Q3|YE)?$/g
        if (!rgx.test(this.state.period)) {
            // send error to client
            console.log('invalid input')
        }
        let [baseY, baseQ] = this.props.getBasePeriod().split(" ");
        let [newY, newQ] = this.state.period.split(" ");
        const diffY = parseInt(newY.substring(0,4)) - parseInt(baseY.substring(0,4));
        let diffQ;
        if (!newQ || !baseQ) {
            diffQ = 0;
        } else {
            if (newQ == "YE") {
                newQ = "Q4";
            }
            if (baseQ == "YE") {
                baseQ = "Q4";
            }
            diffQ = (parseInt(newQ.substring(1)) - parseInt(baseQ.substring(1))) % 4;
        }
        this.callback(diffY, diffQ);
        this.setState({open: false});
    }

    render(){
        return(
            <div>
                <Button variant="outlined" color="primary" onClick={()=>{this.setState({open:true})}}>
                    Update Period
                </Button>
                <Dialog
                    onClose={()=>{this.setState({open:false})}}
                    aria-labelledby="simple-dialog-title"
                    open={this.state.open}
                    fullWidth={true}
                >
                    <DialogTitle id="simple-dialog-title">Update Reporting Period</DialogTitle>
                    <form>
                        <div>
                            <label id="Attributies">Current Period:</label>
                            <input type="text" name="old_p" id="old_p" value={this.state.baseYear} readOnly disabled />
                        </div>
                        <div>
                            <label id="Attributies">New Period:</label>
                            <input type="text" name="old_p" id="old_p" value={this.state.period} onChange={this.updatePeriod}  />
                        </div>
                        
                    </form>
                    <button onClick={this.runUpdate}>Confirm</button>
                </Dialog>
            </div>
        )
    }
}

export default updatePeriodMenu;
