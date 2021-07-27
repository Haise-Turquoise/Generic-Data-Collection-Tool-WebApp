import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Formik } from 'formik';
import Swal from 'sweetalert2';
//@ts-ignore
import * as yup from 'yup';

import { TextField, Button, Typography, Box } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//@ts-ignore
import { selectModifyUserInfoStore } from '../../../store/ModifyUserInfo/selectors';
//@ts-ignore
import { selectFactoryValueById } from '../../../store/common/REST/selectors';
//@ts-ignore
import { ModifyUserInfoStoreActions } from '../../../store/ModifyUserInfo/store';
import {
  getUserInfoPopulatedRequest,
  updateUserInfoRequest,
  //@ts-ignore
} from '../../../store/thunks/ModifyUserInfo';
//@ts-ignore
import UserController from '../../../controllers/user';
//@ts-ignore
import usersController from '../../../controllers/Users';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';
import User from '../../../types/user';

import './ModifyUserInfo.scss';
import { state } from '../../../store/types';

// The header or the title of this page
const Header = () => (
  <div className="d-flex justify-content-between p-2 mb-3">
    <Typography variant="h5">Modify User Info</Typography>
  </div>
);

// The schema to validate user input
const ProfileSchema = (originalUsername:string) =>
  yup.object().shape({
    title: yup.string().required('Please enter your title'),
    username: yup
      .string()
      .min(6, 'Username must be 6 to 20 characters long')
      .max(20, 'Username must be 6 to 20 characters long')
      .test('Unique Username', 'Username has already been used', async function (value?:string | null) {
        const fetchData = await UserController.fetchUserByUserName(value || '');
        // users can only do 1: not change the username, or 2: change the username to something new
        return (
          fetchData.user?.username === originalUsername || fetchData.user?.username === undefined
        );
      })
      .required('Please enter a username'),
    firstName: yup
      .string()
      .required('Please enter first name')
      .max(100, 'Name is too long, please enter an alias or nickname instead'),
    lastName: yup
      .string()
      .required('Please enter last name')
      .max(100, 'Name is too long, please enter an alias or nickname instead'),
    phoneNumber: yup
      .string()
      // .length(10, 'Please enter valid phone number')
      // .matches(/^[0-9]+$/, 'Please enter valid phone number')
      .matches(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/, 'Please enter valid phone number')
      .required('Please enter phone number'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .max(254, 'Email is too long')
      .required('Please enter your email'),
    ext: yup
      .string()
      .matches(/^[0-9]+$/, 'Please enter valid ext number')
      .max(100, 'Ext is too long'),
  });

// Button on the bottom of page
const Buttons = ({ values, handleSubmit}:{values:User; handleSubmit:(values:any)=>void;}) => {
  return (
    <Box color="primary" className="modifyUserInfo__buttonBox" justifyContent="center">
      <Button variant="outlined" color="primary" href="/" style={{ marginTop: '0.8%' }}>
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => handleSubmit(values)}
        style={{ marginLeft: '1%', marginTop: '0.8%' }}
      >
        Update
      </Button>
    </Box>
  );
};

const CustomTextField = ({
  values,
  label,
  labelText,
  handleChange,
  touched,
  handleBlur,
  errors,
  disabled,
}:{
  values:any;
  label:string;
  labelText:string;
  handleChange:()=>void;
  touched:any;
  handleBlur:any;
  errors:any;
  disabled:boolean;
}) => {
  return (
    <div className={label}>
      <div className="modifyUserInfo__label">
        <Typography className="modifyUserInfo__inputTitle">{labelText}</Typography>
      </div>
      <div className="modifyUserInfo__informationField">
        <TextField
          name={label}
          variant="outlined"
          className="modifyUserInfo__field"
          type="text"
          value={values[label]}
          onChange={handleChange}
          error={touched[label] && !!errors[label]}
          helperText={touched[label] && errors[label]}
          onBlur={handleBlur}
          disabled={disabled}
          InputProps={{
            style: {
              height: 50,
              backgroundColor: 'aliceblue',
            },
          }}
        />
      </div>
    </div>
  );
};

// Have the detail UI page for each step
const Content = (props:any) => {
  console.log(props)
  const { values, handleChange, touched, handleBlur, errors } = props;
  return (
    <form className="modifyUserInfo__form">
      <CustomTextField
        values={values}
        label="title"
        labelText="Title"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
      <CustomTextField
        values={values}
        label="lastName"
        labelText="*Last Name"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
      <CustomTextField
        values={values}
        label="firstName"
        labelText="*First Name"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
      <CustomTextField
        values={values}
        label="phoneNumber"
        labelText="Phone Number"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
      <CustomTextField
        values={values}
        label="ext"
        labelText="Ext."
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
      <CustomTextField
        values={values}
        label="email"
        labelText="Email"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={true}
      />
      <CustomTextField
        values={values}
        label="username"
        labelText="*Username"
        handleChange={handleChange}
        touched={touched}
        handleBlur={handleBlur}
        errors={errors}
        disabled={false}
      />
    </form>
  );
};

const init = {
  title: '',
  lastName: '',
  firstName: '',
  phoneNumber: '',
  ext: '',
  email: '',
  username: '',
};

// Main function to export
const ModifyUserInfo = () => {
  const dispatch = useDispatch();

  const userID = localStorage.getItem('currentUserID') || '';
  const email = localStorage.getItem('currentUser') || '';

  const { user } = useSelector((state: state) => {
    const user = selectFactoryValueById(selectModifyUserInfoStore)(userID)(state);
    return { user: user || init };
  }, shallowEqual);

  const originalUsername = user.username;

  useEffect(() => {
    if (email) {
      dispatch(getUserInfoPopulatedRequest(email));
    }
    return () => {
      dispatch(ModifyUserInfoStoreActions.RESET(''));
    };
  }, [dispatch]);

  const handleSubmit = useCallback(
    populatedData => {
      // Reformat data based on the callback of dispatch below
      const formattedUserInfo = {
        _id: userID,
        title: populatedData.title,
        lastName: populatedData.lastName,
        firstName: populatedData.firstName,
        phoneNumber: populatedData.phoneNumber,
        ext: populatedData.ext,
        email: populatedData.email,
        username: populatedData.username,
      };

      // Find the old value before updating in order to Auditlog
      (async () => {
        const oldUser = await usersController.fetchByEmail(email || '');
        CreateAuditLog(null, 'Modify User Info', 'User', oldUser?._id, oldUser, formattedUserInfo);
      })();

      // Do Update
      dispatch(updateUserInfoRequest(formattedUserInfo, null, null, true, populatedData));

      // Alert User
      Swal.fire({
        title: 'Success!',
        text: 'Your profile is updated',
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      }).then(result => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    },
    [dispatch],
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={ProfileSchema(originalUsername)}
      initialValues={user}
      onSubmit={handleSubmit}
    >
      {props => {
        return (
          <div>
            <Header />
            <Content {...props} />
            <Buttons {...props} />
          </div>
        );
      }}
    </Formik>
  );
};

export default ModifyUserInfo;
