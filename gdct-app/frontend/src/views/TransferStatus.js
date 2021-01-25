import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TransferStatusController from '../controllers/TransferStatus';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';




const ReportingPeriodHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">ETL Status</Typography>
    </Paper>
  );
};

const TransferStausPanel = ()=>{
  const [readState, writeState] = useState(true)

  // useEffect(()=>{
  //   axiosBase.get('/getServiceStatus').then(value=>{
  //     console.log("run", value)
  //     if (value.currentActiveProcess){
  //       console.log('here')
  //       setTransferState('The service is active with a sync interval of ' + value.interval + ' minutes.')
  //     }else{
  //       console.log('here 2')
  //       setTransferState('The ETL process currently is not running.')
  //     }
  //   })
  // },[])

  const StartTransfer = ()=>{
    const time = document.getElementById('interval').value;
    console.log(time);
    TransferStatusController.startTransfer(Number(time)).then(()=>{
      console.log('Updated!');
    })
    writeState(!readState);
  }
  const StopTransfer = ()=>{
    TransferStatusController.stopTransfer().then(()=>{console.log('Stopped')})
    writeState(!readState);
  }

  
  return (
    <div>
      <ReportingPeriodHeader/>
      <Paper className="header">
        <Typography variant="h6">Please enter the tranfer period you want</Typography>
        <TextField id="interval" label="Time in minutes" defaultValue="60" type='Number' inputProps={{ inputProps: { min: 1} }}/>
      </Paper>
      <div>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => StartTransfer()}
        >
          Set Transfer interval
        </Button>

        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => StopTransfer()}
        >
          Stop transfer
        </Button>
      </div>
    </div>
  );
  
}

export default TransferStausPanel;