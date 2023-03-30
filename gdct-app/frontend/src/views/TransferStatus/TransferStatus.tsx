import React, { useCallback, useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TransferStatusController from '../../controllers/TransferStatus';
import TransferStatus from '../../types/transferStatus';

const TransferStatusHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">ETL Status</Typography>
    </div>
  );
};

const TransferStausPanel = () => {
  const [transferStatus, setTransferStatus] = useState<string>('');

  useEffect(() => {
    TransferStatusController.fetchStatus().then((data:{status:TransferStatus}) => {
      setTransferStatus(String(data.status.interval));
    });
  },[]);
  
  const StartTransfer = useCallback(() => {
    const time = (document.getElementById('interval') as HTMLInputElement).value;
    TransferStatusController.setTransfer(time);
  }, []);

  const StopTransfer = useCallback(() => {
    TransferStatusController.stopTransfer();
  }, []);

  return (
    <div>
      <TransferStatusHeader />
      <Paper className="header">
        <Typography variant="h6">The current transfer Interval is {transferStatus} minutes</Typography>
        <Typography variant="h6">Please enter an time interval</Typography>
        <TextField
          id="interval"
          label="Time in minutes"
          defaultValue="60"
          type="Number"
          inputProps={{ inputProps: { min: 1 } }}
        />
      </Paper>
      <div>
        <Button color="primary" variant="contained" size="large" onClick={() => StartTransfer()}>
          Set Transfer interval
        </Button>

        <Button color="primary" variant="contained" size="large" onClick={() => StopTransfer()}>
          Stop transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferStausPanel;
