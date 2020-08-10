import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Container } from '@material-ui/core';
import AuthController from '../controllers/Auth';
import { host } from '../constants/domain';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        GDCT
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  authImg: {
    width: '25px',
    height: '25px',
    marginRight: '5px',
    // lineHeight: '15px',
  },
}));

const validEmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const validateForm = errors => {
  let valid = true;
  Object.values(errors).forEach(val => val.length > 0 && (valid = false));
  return valid;
};

export default function Login({ setLoggedIn }) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AuthController.auto().then(auto => {
      if (auto.data === true) {
        setLoggedIn(true);
      }
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    const updatedErrors = { ...errors };

    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'email':
        updatedErrors.email = !validEmailRegex.test(value) ? 'Not a Valid Email' : '';
        setEmail(value);
        setErrors(updatedErrors);
        break;
      default:
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (email && validateForm(errors)) {
        // window.location.replace(
        //   `http://localhost:3000/auth/local?email=${email}&password=${password}`
        // )
        await AuthController.login({ email, password }).then(data => {
          if (data.status === 'ok') {
            setLoggedIn(true);
          }
        });
      }
      // TODO: decide if it is logged in
    } catch (err) {
      console.log(err);
      setLoggedIn(false);
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
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
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
