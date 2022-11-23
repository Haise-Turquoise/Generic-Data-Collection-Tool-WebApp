//@ts-ignore
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Formik } from 'formik';
//@ts-ignore
import Swal, { SweetAlertResult } from 'sweetalert2';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//@ts-ignore
import Typography from '@material-ui/core/Typography';

import './NewPassword.scss';
import Box from '@material-ui/core/Box';
//@ts-ignore
import * as yup from 'yup';

import bcrypt from 'bcryptjs';

import {
  submit
  //@ts-ignore
} from '../../store/thunks/UserNewPassword';
//@ts-ignore
import UserController from '../../controllers/user';
import userController from '../../controllers/user';

// The schema to validate user input
const registerSchema = () =>
  yup.object().shape({
    password: yup
      .string()
      .min(8, 'The given password is too short. Password must be at least 8 character(s) long')
      .matches(
        /[{0-9}]/,
        'Password has too few numeric characters (0-9). The password must have at least 1 numeric character(s)',
      )
      .matches(
        /[{a-z}{A-Z}}]/,
        'Password has too few alphabetic characters (A-Z, a-z). The password must have at least 2 alphabetic character(s)',
      )
      .required('Please enter a password'),
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref('password'), undefined], 'Password should match with Verify Password')
      .required('Please confirm your password'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .max(254, 'Email is too long')
      .required('Please enter your email'),
  });

// Button on the bottom of page
const ButtonBox = ({ values, handleSubmit }: { values: object; handleSubmit: (values: object) => void }) => (
  <Box border={1} color="primary" className="register__buttonBox" justifyContent="center">

    <Button variant="outlined" color="primary" className="register__button" href="/login">
      Cancel
    </Button>

    <Button
      variant="outlined"
      color="primary"
      className="register__button"
      onClick={() => handleSubmit(values)}
    >
      Update
    </Button>
    <br />
    <br />
    <Typography className="register__subtext" >
      Please use the navigation buttons on this page to move between the registration steps.
      Using the browser's Back and Forward buttons will remove the inputted information.
    </Typography>
  </Box>
);

// Have the detail UI page for each step
const getStepContent = (
  handleSubmit: (values: any) => void,
  props: any,
) => {
  const { values, handleChange, touched, handleBlur, errors, isValid } = props;
  const dispatch = useDispatch();

  return (
    <div>
      <form className="register__form">
        <br />
        <div className="register__label">
          <Typography className="register__inputTitle"> *Email </Typography>
        </div>
        <div className="register__informationField">
          <TextField
            variant="outlined"
            className="register__field"
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            InputProps={{
              style: {
                height: 50,
                backgroundColor: 'aliceblue',
              },
            }}
          />
        </div>
        <br />
        <div className="register__label">
          <Typography className="register__inputTitle"> *Password </Typography>
        </div>
        <div className="register__informationField">
          <TextField
            variant="outlined"
            className="register__field"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            InputProps={{
              style: {
                height: 50,
                backgroundColor: 'aliceblue',
              },
            }}
          />
        </div>
        <br />
        <div className="register__label">
          <Typography className="register__inputTitle"> *Confirm Password </Typography>
        </div>
        <div className="register__informationField">
          <TextField
            variant="outlined"
            className="register__field"
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={values.passwordConfirm}
            onChange={handleChange}
            error={touched.passwordConfirm && !!errors.passwordConfirm}
            helperText={touched.passwordConfirm && errors.passwordConfirm}
            onBlur={handleBlur}
            InputProps={{
              style: {
                height: 50,
                backgroundColor: 'aliceblue',
              },
            }}
          />
        </div>
        <br />
        <ButtonBox
          handleSubmit={handleSubmit}
          values={values}
        />
      </form>
    </div>
  );
};

// Get the state and shown it on the website
const Register_container = (props: any) => {
  const history = useHistory();
  const handleSubmit = useCallback(async (values: any) => {
    let { email, password } = values;
    email = email.toLowerCase();
    password = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const fetchData = await userController.fetchUserByEmail(email);

    if (fetchData.user?._id != undefined) {
      userController.updatePasswordByUserEmail(email, password).catch(error => {
        throw new Error(error);
      });
      Swal.fire({
        title: 'Success!',
        text: 'Your request has been submitted',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      }).then((result: SweetAlertResult<any>) => {
        if (result.isConfirmed) {
          // window.location.reload();
          history.push('/');
        }
      });
    } else {
      Swal.fire({
      title: 'Error!',
      text: 'You entered a wrong Email',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then((result: SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        // window.location.reload();
        history.push('/');
      }
    });}
  }, []);

  return (
    <div>
      {getStepContent(
        handleSubmit,
        props,
      )}
    </div>
  );
};

// Main function to export
const Register = () => {
  const handleSubmit = () => { };
  const dispatch = useDispatch();
  const { passwordData } = useSelector(
    // @ts-ignore
    ({ UserNewPasswordStore: { passwordData } }) => ({
      passwordData,
    }),
    shallowEqual,
  );
  // const { passwordData } = useSelector(
  //   // @ts-ignore
  //   ({ UserNewPasswordStore: { passwordData: {
  //     email: "",
  //     password: "",
  //     passwordConfirm: ""
  //   } } }) => ({
  //     passwordData,
  //   }),
  //   shallowEqual,
  // );

  return (
    <div>
      {/* <SRIHeader/> */}
      <div className="register">
        <br />
        <Paper className="register__container">
          <Formik
            validationSchema={registerSchema}
            initialValues={passwordData}
            onSubmit={handleSubmit}
            render={formikProps => <Register_container {...formikProps} />}
          />
        </Paper>
      </div>
    </div>
  );
};
export default Register;
