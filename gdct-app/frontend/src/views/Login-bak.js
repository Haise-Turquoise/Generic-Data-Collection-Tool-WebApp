import React, { useState } from 'react';

import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import { Formik } from 'formik';

import {
  ROUTE_PUBLIC_PREREGISTER,
  ROUTE_PUBLIC_RECOVERY,
  ROUTE_USER_PROFILE,
} from '../constants/routes';

const RegisterButton = () => (
  <Link to={ROUTE_PUBLIC_PREREGISTER}>
    <Button
      className="loginButtonsMain__button loginButtonsMain__register"
      variant="contained"
      color="primary"
    >
      Register
    </Button>
  </Link>
);

const MainButtons = () => (
  <div className="loginButtonsMain">
    <Button
      className="loginButtonsMain__button loginButtonsMain__login"
      variant="contained"
      color="primary"
      type="submit"
    >
      Login
    </Button>
    <RegisterButton />
  </div>
);

const RecoveryButton = () => (
  <Link to={ROUTE_PUBLIC_RECOVERY}>
    <Button size="small">Forgot Password?</Button>
  </Link>
);

const LoginButtons = () => (
  <div>
    <RecoveryButton />
    <MainButtons />
  </div>
);

const LoginForm = ({ handleLogin }) => (
  <Formik
    initialValues={{ username: 'sampleuser', password: 'password123@' }}
    onSubmit={(values, { setSubmitting }) => handleLogin(values, setSubmitting)}
  >
    {({ handleSubmit, handleChange, values }) => (
      <Paper className="login__container">
        <form className="login__form" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <p className="text-muted">Sign In to your account</p>
          <TextField
            className="login__field"
            label="Username"
            id="username"
            name="username"
            type="username"
            autoComplete="username"
            autoFocus={true}
            value={values.username}
            onChange={handleChange}
          />
          <TextField
            className="login__field"
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
          />
          <LoginButtons />
        </form>
      </Paper>
    )}
  </Formik>
);

const Login = ({ history }) => {
  const handleLogin = () => history.push('/sheetNames');

  return (
    <div className="login">
      <LoginForm handleLogin={handleLogin} />
    </div>
  );
};

export default Login;
