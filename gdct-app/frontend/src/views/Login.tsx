import React, { useState, useEffect,ChangeEvent } from 'react';
import {
  Avatar,
  Button,
  Box,
  CssBaseline,
  Checkbox,
  Container,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Grid,
  Link,
  Snackbar,
  TextField,
  Typography,
  Select,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';

import { useDispatch } from 'react-redux';
import moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';
//@ts-ignore
import { host } from '../constants/domain';
//@ts-ignore
import AuthController from '../controllers/Auth';
//@ts-ignore
import CreateAuditLog from './AuditLog_Global';
//@ts-ignore
import SessionController from '../controllers/Session';
//@ts-ignore
import AppConfigController from '../controllers/AppConfig';
//@ts-ignore
import usersController from '../controllers/Users';
//@ts-ignore
import UserStore from '../store/UserStore/store';


import SysRole from '../types/sysrole';
import User from '../types/user';
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
function Alert(props:{onClose:(event:any, reason:string)=>void, severity:any, children:string}) {
  //@ts-ignore
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
    minWidth: '120px',
  },
  selectLabel: {
    padding: theme.spacing(0, 1),
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
const validateForm = (errors:Object) => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default function Login({ setLoggedIn }:{setLoggedIn:(flag:boolean)=>void}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [userFeedback, setUserFeedback] = useState('');
  const [checkLogin, setCheckLogin] = useState('false');
  const [open, setOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [attempts, setCount] = useState(4);

  const displayUserFeedback = () => {
    setOpen(true);
  };

  const handleClose = (event:any, reason:string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleChange = (e:ChangeEvent<{name?: string, value: string}>) => {
    const { name, value } = e.target;
    const updatedErrors = { ...errors };

    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'email':
        // @ts-ignore
        updatedErrors.email = !validEmailRegex.test(value) ? 'Not a Valid Email' : '';
        setEmail(value.toLowerCase()); 
        setErrors(updatedErrors);
        break;
      case 'role':
        setSelectedRole(value.toString());
        break;
      default:
    }
  };

  let sessionID:string|null = null;
  // onSubmit for sign in button
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    let checkLogin;
    try {
      if (email && validateForm(errors)) {
        // logic to verify validity of submitter role
        const { sysRole } = await usersController.fetchByEmail(email) || { sysRole: null };
        if (!sysRole) {
          return
        }
        const possibleRoles = sysRole.reduce((acc:any, curr:SysRole) => acc.concat(curr.role), []);
        let currentRole = selectedRole;
        if (possibleRoles.length < 2) {
          currentRole = sysRole[0].role;
        } else if (!possibleRoles.includes(currentRole)) {
          handleUpdateRoles();
          setLoggedIn(false);
          return;
        }

        checkLogin = await AuthController.login({ email, password, selectedRole })
          .then((data:undefined|{data:{email:string, _id:string, sessionID:string}, status:string}) => {
            if (data === undefined) {
              return false;
            }
            if (data.status === 'ok') {
              // picks first role if signing in with autofill
              localStorage.setItem('currentUser', data.data.email);
              localStorage.setItem('currentUserID', data.data._id);
              localStorage.setItem('currentRole', currentRole);
              sessionID = data.data.sessionID;
              // Audit Login
              CreateAuditLog(email, 'Login', 'Login', null, {}, {});
              // Set status
              setLoggedIn(true);
              return true;
            }
          })
          .catch((err:any) => {
            console.log(err);
          });
      }
      if (!checkLogin) {
        console.log('not login in');

        setCount(attempts-1);
        if(attempts>0){
          alert(attempts+" MORE ATTEMPTS");
        } else {
          alert("NO MORE LOGIN ATTEMPTS");
          (document.getElementById("loginform") as any).disabled=true;
          (document.getElementById("email") as any).disabled=true;
          (document.getElementById("password") as any).disabled=true;
          (document.getElementById("loginbutton") as any).disabled=true;
          (document.getElementById("googlebutton") as any).disabled=true;
          (document.getElementById("facebookbutton") as any).disabled=true;
        }
        displayUserFeedback();
      }
    } catch (err) {
      console.log(err);
      setLoggedIn(false);
    }
  };

  const handleUpdateRoles = () => {
    usersController
      .fetchByEmail(email)
      .then((data:User | null) => {
        //@ts-ignore
        setRoles(data.sysRole.map(role => role.role));
        // set selected role manually if only one available
        if (data && data.sysRole.length >= 1) {
          setSelectedRole(data.sysRole[0].role);
        }
      })
      .catch(() => setRoles([]));
  };

  // Session Timer
  const Timer = async () => {
    const sessionCheckingPeriod = await AppConfigController.fetchSessionCheckingPeriod();
    if (!sessionCheckingPeriod) return
    const period = sessionCheckingPeriod.value;
    let i = 0;
    while (i < 60) {
      (function (i) {
        setTimeout(function () {
          SessionController.fetchById(sessionID || '').then((session:{expires:string}) => {
            if (session !== null) {
              const expirationTime = session.expires;
              const currentTime = moment();
              const remainingMinutes = moment(expirationTime).diff(currentTime, 'minutes');
              const remainingSeconds = moment(expirationTime).diff(currentTime, 'seconds');
              // console.log(`${remainingMinutes}  ${remainingSeconds}`);

              // Session only has at most 5 minutes
              if (remainingMinutes === 5 || remainingMinutes === 1) {
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger',
                  },
                });
                swalWithBootstrapButtons
                  .fire({
                    title: `Session expiring in ${remainingMinutes} minutes`,
                    text: 'Unsaved process maybe lost if session expires',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Reset it',
                    cancelButtonText: 'Cancel',
                    reverseButtons: true,
                  })
                  .then((result:SweetAlertResult<any>) => {
                    if (result.isConfirmed) {
                      SessionController.updateExpiration(sessionID || '');
                      swalWithBootstrapButtons.fire(
                        'Reset!',
                        'Your session has been reset',
                        'success',
                      );
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                      swalWithBootstrapButtons.fire('Cancelled', 'Session expiring...', 'error');
                    }
                  });
              }
              // Session has expired
              else if (remainingMinutes === 0 && remainingSeconds <= 0) {
                Swal.fire({
                  title: 'Session has expired!',
                  text: 'You will be redirected to the login page',
                  icon: 'warning',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK',
                }).then((result:SweetAlertResult<any>) => {
                  if (result.isConfirmed) {
                    dispatch(UserStore.actions.LOGOUT(false));
                    window.location.reload();
                    // dispatch(UserStore.actions.LOGOUT(false));
                  }
                });
              }
            }
          });
        }, +period * 60 * 1000 * i);
      })(i++);
    }
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
        <form id="loginform" onSubmit={handleSubmit} onClick={Timer} className={classes.form} noValidate>
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
          {roles.length > 1 && (
            <FormControl fullWidth variant="outlined" className={classes.select}>
              <InputLabel id="role-selector-label" required>
                Role
              </InputLabel>
              <Select
                labelWidth={40}
                labelId="role-selector-label"
                id="role-selector"
                name="role"
                value={selectedRole}
                onChange={(e:any) => setSelectedRole(e.target.value.toString())} // toString for consistent types
              >
                {roles.map((role, index) => (
                  <MenuItem value={role} key={index}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
            id="loginbutton"
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
            style={{
              marginBottom: '24px',
            }}
            onClick={() => {
              if(attempts==0) alert("NO MORE LOGIN ATTEMPTS");
            }}
          >
            Sign In
          </Button>
          <Button
            id="googlebutton"
            fullWidth
            variant="outlined"
            color="default"
            className={classes.submit}
            style={{
              marginTop: 0,
              marginBottom: 0,
            }}
            onClick={() => {
              if(attempts>0) {
                window.location.href = `${host}/auth/google/`;
              } else {
                alert("NO MORE LOGIN ATTEMPTS");
              }
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
            id="facebookbutton"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => {
              if(attempts>0) {
                window.location.href = `${host}/auth/facebook/`;
              } else {
                alert("NO MORE LOGIN ATTEMPTS");
              }
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
              <Link href="/updatePassword" variant="body2">
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
