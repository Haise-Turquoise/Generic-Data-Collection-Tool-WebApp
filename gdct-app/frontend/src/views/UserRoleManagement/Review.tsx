import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import SysRole from '../../types/sysrole'

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  buttons: {},
  button: {},
}));

export default function Review({
  firstName,
  lastName,
  email,
  title,
  phoneNumber,
  ext,
  sysRoles,
  steps,
  activeStep,
  handleNext,
  handleBack,
}: {
  firstName: string,
  lastName: string,
  email: string,
  title: string,
  phoneNumber: string,
  ext: string,
  sysRoles: SysRole[],
  steps: string[],
  activeStep: number,
  handleNext: () => void,
  handleBack: () => void,
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Grid container>
            <Grid item xs={6}>
              <Typography gutterBottom>First Name</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{firstName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Last Name</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{lastName}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Email</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Roles</Typography>
            </Grid>
              <ol>
              {sysRoles.map(appSys => (
                <li>
                  <React.Fragment key={appSys._id}>
                  <Grid item xs={12}>
                    <Typography gutterBottom>{appSys.appSys}</Typography>
                    <Typography gutterBottom>{appSys.role}</Typography>
                  </Grid>
                </React.Fragment>
                </li>
              ))}
              </ol>
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Grid container>
            <Grid item xs={6}>
              <Typography gutterBottom>Title</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{title}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>Phone Number</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{`${phoneNumber} ${ext}`}</Typography>
            </Grid>

           </Grid>
        </Grid>
      </Grid>
      <div className={classes.buttons} style={{ marginTop: '2rem', textAlign: 'right' }}>
        {activeStep !== 0 && (
          <Button onClick={handleBack} className={classes.button}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
          type="submit"
        >
          {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
        </Button>
      </div>
    </React.Fragment>
  );
}
