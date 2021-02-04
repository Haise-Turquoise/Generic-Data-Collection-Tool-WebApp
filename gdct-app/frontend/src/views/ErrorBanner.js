import { useSelector, shallowEqual } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { selectFactoryRESTError } from '../store/common/REST/selectors';

import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

/*
    This component takes in error message and a store to check for error in store and display them.

    Example use:
        <ErrorBanner title="Error" store={some store}/>
        
    Written by Harry Ryu at 2020/12/30, modified and optimized by Sheldon Su at 2020/01/05.
*/

const ErrorBanner = (props) => {
    let [showingAlert, setShowingAlert] = useState(false);
  
    const { errors } = useSelector(
      state => ({
        errors: selectFactoryRESTError(props.targetStore)(state)
      }),
      shallowEqual,
    );
  
    useEffect(() => {
      if (errors){
        setShowingAlert(true);
      }
    }, [errors]);

    // Set alert display time
    useEffect(() => {
      if (showingAlert){
        setTimeout(()=>{
          setShowingAlert(false)
        }, 5000)
      }
    }, [showingAlert]);
  
    return (
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={showingAlert} autoHideDuration={10000}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setShowingAlert(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
        }
      >
        <h6>{props.title}</h6>
      </Alert>
    </Snackbar>
    );
  };

  export default ErrorBanner;