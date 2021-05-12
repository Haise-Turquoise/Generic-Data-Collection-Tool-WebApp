import React, { useState, useEffect } from 'react';
import { Avatar, Button, Box, CssBaseline, Checkbox, Container, MenuItem, FormControl, InputLabel,
         FormControlLabel, Grid, Link, Snackbar, TextField, Typography, Select } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

import { useDispatch } from 'react-redux';
import { host } from '../constants/domain';
import AuthController from '../controllers/Auth';

import CreateAuditLog from './AuditLog_Global';
import SessionController from '../controllers/Session';

import usersController from '../controllers/Users'

import moment from 'moment';
import Swal from 'sweetalert2';
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        MOH - OHFS Budgeting and Forecasting 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  select: {
    marginTop: theme.spacing(2),
    minWidth: '120px'
  },
  selectLabel: {
    padding: theme.spacing(0, 1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  authImg: {
    width: '25px',
    height: '25px',
    marginRight: '5px',
    // lineHeight: '15px',
  },
  // root: {
  //   width: '100%',
  //   '& > * + *': {
  //     marginTop: theme.spacing(2),
  //   },
  // },
}));

const validEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default function Login({ setLoggedIn }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [userFeedback, setUserFeedback] = useState('');
  const [checkLogin, setCheckLogin] = useState('false');
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = useState('')
  const [roles, setRoles] = useState([])

  const displayUserFeedback = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedErrors = { ...errors };

    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'email':
        // @ts-ignore
        updatedErrors.email = !validEmailRegex.test(value) ? 'Not a Valid Email' : '';
        setEmail(value);
        setErrors(updatedErrors);
        break;
      case 'role':
        setSelectedRole(value.toString())
        break
      default:
    }
  };

  let sessionID = null;
  // onSubmit for sign in button
  const handleSubmit = async e => {
    e.preventDefault();

    let checkLogin;
    try {
      if (email && validateForm(errors)) {
        // logic to verify validity of submitter role
        const { sysRole } = await usersController.fetchByEmail(email)
        const possibleRoles = sysRole.reduce((acc, curr) => acc.concat(curr.role), [])
        let currentRole = selectedRole
        if (possibleRoles.length < 2) {
          currentRole = sysRole[0].role
        } else if (!possibleRoles.includes(currentRole)) {
          handleUpdateRoles()
          setLoggedIn(false)
          return
        }

        checkLogin = await AuthController.login({ email, password, selectedRole })
          .then(data => {
            if (data === undefined) {
              return false;
            }
            if (data.status === 'ok') {
              // picks first role if signing in with autofill
              localStorage.setItem('currentUser', data.data.email);
              localStorage.setItem('currentUserID', data.data._id);
              localStorage.setItem('currentRole', currentRole)
              sessionID = data.data.sessionID;
              // Audit Login
              CreateAuditLog(email, 'Login', 'Login', null, {}, {});
              // Set status
              setLoggedIn(true);
              return true;
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
      if (!checkLogin) {
        console.log('not login in');

        displayUserFeedback();
      }
    } catch (err) {
      console.log(err);
      setLoggedIn(false);
    }
  };

  const handleUpdateRoles = () => {
    usersController.fetchByEmail(email)
    .then(data => {
      setRoles(data.sysRole.map(role => role.role))
      // set selected role manually if only one available
      if (data.sysRole.length >= 1) {
        setSelectedRole(data.sysRole[0].role)
      }
    })
    .catch(() => setRoles([]))
  }

  // Session Timer
  const Timer = () => {
    let i = 0;
    while (i < 60) {
      (function(i) {
        setTimeout(function() {
          console.log(sessionID);
          SessionController.fetchById(sessionID)
            .then(session => {
              const expirationTime = session.expires;
              const currentTime = moment();
              const remainingMinutes = moment(expirationTime).diff(currentTime, 'minutes');
              const remainingSeconds = moment(expirationTime).diff(currentTime, 'seconds');
              console.log(`${remainingMinutes}  ${remainingSeconds}`);

              // Session only has at most 5 minutes
              if (remainingMinutes === 5 || remainingMinutes === 1) {
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                  },
                })
                swalWithBootstrapButtons.fire({
                  title: `Session expiring in ${remainingMinutes} minutes`,
                  text: "Unsaved process maybe lost if session expires",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Reset it',
                  cancelButtonText: 'Cancel',
                  reverseButtons: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    SessionController.updateExpiration(sessionID);
                    swalWithBootstrapButtons.fire(
                      'Reset!',
                      'Your session has been reset',
                      'success'
                    )
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                    swalWithBootstrapButtons.fire(
                      'Cancelled',
                      'Session expiring...',
                      'error'
                    )
                  }
                })
              }
              // Session has expired
              else if (remainingMinutes === 0 && remainingSeconds <= 0) {
                Swal.fire({
                  title: 'Session has expired!',
                  text: "You will be redirected to the login page",
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                })
              }
            })
        }, 10 * 1000 * i)
      })(i++)
    };
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form onSubmit={handleSubmit} onClick={Timer} className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            onBlur={handleUpdateRoles}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            value={password}
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            onChange={handleChange}
          />
          {/* show role selector only if > 1 roles to choose from */}
          {roles.length > 1 && <FormControl fullWidth variant='outlined' className={classes.select}>
            <InputLabel id='role-selector-label' required>Role</InputLabel>
            <Select
              labelWidth={40}
              labelId='role-selector-label'
              id='role-selector'
              name='role'
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value.toString())} // toString for consistent types
            >
              {roles.map((role, index) => <MenuItem value={role} key={index}>{role}</MenuItem>)}
            </Select>
          </FormControl>}
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              Please enter the correct password or email
            </Alert>
          </Snackbar>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            style={{
              marginBottom: '24px',
            }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="default"
            className={classes.submit}
            style={{
              marginTop: 0,
              marginBottom: 0,
            }}
            onClick={() => {
              window.location.href = `${host}/auth/google/`;
            }}
          >
            <div>
              <img
                className={classes.authImg}
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt=""
              />
              Sign in with Google
            </div>
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => {
              window.location.href = `${host}/auth/facebook/`;
            }}
          >
            <div>
              <img
                className={classes.authImg}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/267px-F_icon.svg.png"
                alt=""
              />
              Sign in with Facebook
            </div>
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
          <Grid item>
            <Link href="/register" variant="body2">
              {'Register'}
            </Link>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
