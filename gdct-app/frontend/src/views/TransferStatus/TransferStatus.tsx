import React, { useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TransferStatusController from '../../controllers/TransferStatus';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTransferStatusStore } from '../../store/TransferStatusStore/selectors';
import { startTransferRequest, stopTransferRequest } from '../../store/thunks/TransferStatus';

const TransferStatusHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">ETL Status</Typography>
    </Paper>
  );
};

const TransferStausPanel = () => {
  const [readState, writeState] = useState(true);
  const dispatch = useDispatch();
  const temp = useSelector(
    state => ({
      respond: selectFactoryRESTResponseTableValues(selectTransferStatusStore)(state),
    }),
    shallowEqual,
  );
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

  const StartTransfer = useCallback(() => {
    const time = (document.getElementById('interval') as HTMLInputElement).value;
    console.log(time);
    dispatch(startTransferRequest(time));
    writeState(!readState);
  }, []);

  const StopTransfer = useCallback(() => {
    dispatch(stopTransferRequest());
    writeState(!readState);
  }, []);

  return (
    <div>
      <TransferStatusHeader />
      <Paper className="header">
        <Typography variant="h6">Please enter the tranfer period you want</Typography>
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
