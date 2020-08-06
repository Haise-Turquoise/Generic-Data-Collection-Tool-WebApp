import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function MandatoryInfo({
  parentHandleChange,
  steps,
  activeStep,
  handleNext,
  handleBack,
}) {
  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);

  const myFormSchema = Yup.object().shape({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    password: Yup.string().required('Required'),
  });
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
          }}
          validationSchema={myFormSchema}
          onSubmit={(values, { resetForm }) => {
            console.log(values);
            parentHandleChange('firstName', values.firstName);
            parentHandleChange('lastName', values.lastName);
            parentHandleChange('username', values.username);
            parentHandleChange('email', values.email);
            parentHandleChange('password', values.password);
            handleNext();
            // setSubmitting({ submitting: true })
            // // submit to server
            // setTimeout(() => {
            //   resetForm()
            //   setSubmitting({ submitting: false })
            // }, 2000)
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    value={values.firstName}
                    variant="standard"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.firstName && touched.firstName ? (
                    <div style={{ color: 'red' }}>{errors.firstName}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="standard"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    autoComplete="lname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.lastName && touched.lastName ? (
                    <div style={{ color: 'red' }}>{errors.lastName}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="standard"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value={values.username}
                    autoComplete="uname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.username && touched.username ? (
                    <div style={{ color: 'red' }}>{errors.username}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="standard"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    autoComplete="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && touched.email ? (
                    <div style={{ color: 'red' }}>{errors.email}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="standard"
                    required
                    fullWidth
                    name="password"
                    value={values.password}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && touched.password ? (
                    <div style={{ color: 'red' }}>{errors.password}</div>
                  ) : null}
                </Grid>
              </Grid>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              <div className={classes.buttons} style={{ marginTop: '2rem', textAlign: 'right' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </Container>
  );
}
