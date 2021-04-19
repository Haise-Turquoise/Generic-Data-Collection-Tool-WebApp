// import React from 'react';

// const NotFound = () => {
//     console.log('Hello world');
//     return (<div>Page not found</div>)
// };

// export default NotFound; 

import React, { lazy, useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Formik } from 'formik';
import cloneDeep from 'clone-deep';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FilteredMultiSelect from 'react-filtered-multiselect';

import './ModifyUserInfo.scss';
import Box from '@material-ui/core/Box';
import * as yup from 'yup';
import MaterialTable from 'material-table';

import { useTranslation } from 'react-i18next';

import {
  orgGroupChange,
  snackbarClose,
  stepBack,
  stepUpdate,
  submit,
  appSysChange,
  orgChange,
  programChange,
  changeSubmission,
  changePermission,
  searchOrganization,
  searchKeyChange,
  referenceChange,
} from '../../../store/thunks/userRegistration';
import { getUsersRequest } from '../../../store/thunks/users';
import { fetchUserByUsername } from '../../../store/thunks/user';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectModifyUserInfoStore } from '../../../store/ModifyUserInfo/selectors';
import { selectUserRegistrationStore } from '../../../store/UserRegistrationStore/selectors';
import UserController from '../../../controllers/user';

import { getUserInfo } from '../../../store/thunks/userRegistration';

// const ModifyUserInfoHeader = () => {
//     return (
//       <Paper className="header">
//         <Typography variant="h5">Update Peronal Details</Typography>
//         {/* <HeaderActions/> */}
//       </Paper>
//     );
//   };

//   const ModifyUserInfoTable = () => {
//     const dispatch = useDispatch();
//     const [readRowNum, setRowNum] = useState(1);


// Column for permission table.
// const columns = [
//   { title: 'Organization', field: 'organization.name' },
//   { title: 'Program', field: 'program.code' },
//   { title: 'Submission', field: 'submission.name' },
//   { title: 'Permission', field: 'permission' },
//   {
//     title: 'Authoritative Person Name',
//     field: 'organization.authorizedPerson.name',
//   },
//   {
//     title: "Authoritative Person's Phone Number",
//     field: 'organization.authorizedPerson.phone',
//   },
//   {
//     title: "Authoritative Person's Email",
//     field: 'organization.authorizedPerson.email',
//   },
// ];

// The schema to validate user input
const registerSchema = () =>
  yup.object().shape({
    title: yup.string().required('Please enter your title'),
    username: yup
      .string()
      .min(6, 'Username must be 6 to 20 characters long')
      .max(20, 'Username must be 6 to 20 characters long')
      .test('Unique Username', 'Username has already been used', async function (value) {
        const fetchData = await UserController.fetchUserByUserName(value);

        if (Object.keys(fetchData.user).length === 0 && fetchData.user.constructor === Object) {
          return true;
        }
        return false;
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
const ButtonBox = ({
  activeStep,
  ableToComplete,
  values,
  isValid,
  handleBack,
  handleUpdate,
  handleSubmit,
}) => (
  <Box border={1} color="primary" className="register__buttonBox" justifyContent="center">

    <Button variant="outlined" color="primary" className="register__button" href="/login">
      Cancel
    </Button>

    <Button
    //   disabled={activeStep == 0 || !isValid}
      variant="outlined"
      color="primary"
      className="register__button"
      onClick={() => handleUpdate(values)}
    >
      Update
    </Button>

    {/* <Button
      disabled={!ableToComplete || activeStep !== 1}
      variant="outlined"
      color="primary"
      className="register__button"
      onClick={handleSubmit}
    >
      COMPLETE REGISTRATION
    </Button>
    <Typography className="register__inputTitle">
      To navigate from one page to the next for registration, please use the button provided on the
      page. Do not use your browsers's Back and Forward buttons.
    </Typography> */}
  </Box>
);

// Have the detail UI page for each step
const getStepContent = (
  snackbarMessage,
  activeStep,
  searchKey,
  reference,
  organizationGroup,
  isSnackbarOpen,
  userOrganizations,
  userPrograms,
  userSubmissions,
  userPermissions,
  appSysOptions,
  organizationGroupOptions,
  organizationOptions,
  programOptions,
  ableToComplete,
  handleOrgGroupChange,
  handleBack,
  handleUpdate,
  handleSubmit,
  handleAppSysChange,
  handleOrgChange,
  handleProgramChange,
  handleChangeSubmission,
  handleChangePermission,
  props,
) => {
  const { values, handleChange, touched, handleBlur, errors, isValid } = props;
  const [userSubmissionsLength, setSubmissionsLength] = useState(1);
  const [userPermissionsLength, setPermissionsLength] = useState(1);
  const [maxPhoneLength, setMaxPhoneLength] = useState(10);

  useEffect(() => {
    setSubmissionsLength(userSubmissions.length);
  }, [userSubmissions]);

  useEffect(() => {
    setPermissionsLength(userPermissions.length);
  }, [userPermissions]);

  const calculateOptions = itemCount => {
    let length = itemCount;
    if (length > 100) length = 100;
    else if (length == 0) length = 1;
    return {
      actionsColumnIndex: -1,
      search: false,
      showTitle: false,
      maxBodyHeight: '400px',
      pageSize: length,
    };
  };

  const calculateMaxLength = value => {
    let max = 10;
    for (const character of value) {
      if (character == '-') {
        max = 12;
      }
    }

    return { maxLength: max };
  };
  const userSubmissionsOptions = useMemo(() => calculateOptions(userSubmissionsLength), [
    userSubmissionsLength,
  ]);
  const userPermissionsOptions = useMemo(() => calculateOptions(userPermissionsLength), [
    userPermissionsLength,
  ]);
  const maxLengthSize = useMemo(() => calculateMaxLength(values.phoneNumber), [values.phoneNumber]);

console.log(values)

  switch (activeStep) {
    case 0:
      const {t, i18n} = useTranslation();
      return (
        <>
          <form className="register__form">
            <br />
            <div className="register__label">
              <Typography className="register__inputTitle">
                {' '}
                {t('UserRegistration.title')}{' '}
              </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="title"
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                onBlur={handleBlur}
                InputProps={{
                  style: {
                    height: 50,
                    backgroundColor: 'aliceblue',
                  },
                }}
              />
            </div>
            <div className="register__label">
              <Typography className="register__inputTitle"> *Last Name </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="lastName"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                error={touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                onBlur={handleBlur}
                InputProps={{
                  style: {
                    height: 50,
                    backgroundColor: 'aliceblue',
                  },
                }}
              />
            </div>
            <div className="register__label">
              <Typography className="register__inputTitle"> *First Name </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="firstName"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                error={touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
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
              <Typography className="register__inputTitle">
                {' '}
                {t('UserRegistration.phoneNumber')}{' '}
              </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={values.phoneNumber}
                onChange={handleChange}
                error={touched.phoneNumber && !!errors.phoneNumber}
                helperText={touched.phoneNumber && errors.phoneNumber}
                onBlur={handleBlur}
                InputProps={{
                  style: {
                    height: 50,
                    backgroundColor: 'aliceblue',
                  },
                }}
                inputProps={maxLengthSize}
              />
            </div>
            <div className="register__label">
              <Typography className="register__inputTitle"> Ext. </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="ext"
                name="ext"
                type="ext"
                value={values.ext}
                onChange={handleChange}
                error={touched.ext && !!errors.ext}
                helperText={touched.ext && errors.ext}
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
              <Typography className="register__inputTitle"> Email </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                disabled = {true}
                label=""
                color="secondary"
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
              <Typography className="register__inputTitle"> User ID </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                disabled = {true}
                variant="outlined"
                className="register__field"
                id="username"
                name="username"
                type="username"
                value={values.username}
                onChange={handleChange}
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
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
              activeStep={activeStep}
              ableToComplete={ableToComplete}
              values={values}
              isValid={isValid}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              handleUpdate={handleUpdate}
            />
          </form>
        </>
      );
    case 1:
      const submissionList = cloneDeep(userSubmissions);
      const permissionList = cloneDeep(userPermissions);
      return (
        <div className="register__form">
          {selectOrgProgram(
            searchKey,
            reference,
            organizationGroup,
            organizationOptions,
            organizationGroupOptions,
            appSysOptions,
            programOptions,
            handleAppSysChange,
            handleOrgGroupChange,
            handleOrgChange,
            handleProgramChange,
          )}

          <div className="register__tableContainer">
            <MaterialTable
              className="register__table"
              key={userSubmissionsLength}
              columns={checkBoxColumns}
              // options={{
              //   toolbar: false,
              //   showTitle: false,

              //   headerStyle: {
              //     backgroundColor: '#f2f5f7',
              //   },
              // }}
              options={userSubmissionsOptions}
              style={{
                backgroundColor: '#f2f5f7',
              }}
              data={submissionList}

              // editable={editable} options={options}
            />
          </div>

          <Button
            variant="outlined"
            color="primary"
            className="register__step3Button"
            onClick={handleChangeSubmission}
          >
            Add Submission
          </Button>
          <div className="register__tableContainer">
            <MaterialTable
              className="register__table"
              key={userPermissionsLength}
              columns={columns}
              // options={{
              //   toolbar: false,
              //   showTitle: false,

              //   headerStyle: {
              //     backgroundColor: '#f2f5f7',
              //   },
              // }}
              options={userPermissionsOptions}
              style={{
                backgroundColor: '#f2f5f7',
              }}
              data={permissionList}
            />
            <ButtonBox
              activeStep={activeStep}
              handleBack={handleBack}
              handleUpdate={handleUpdate}
              ableToComplete={ableToComplete}
              handleSubmit={handleSubmit}
              values={values}
              isValid={isValid}
            />
          </div>
        </div>
      );
    default:
      return <Typography>Select campaign settings...</Typography>;
  }
};

// Get the state and shown it on the website
const Register_container = props => {
  const dispatch = useDispatch();
  const handleOrgGroupChange = useCallback(event => {
    dispatch(orgGroupChange(event));
  }, []);
  const handleSnackbarClose = useCallback(() => {
    dispatch(snackbarClose());
  }, []);
  const handleBack = useCallback(() => {
    dispatch(stepBack());
  }, []);
  const handleUpdate = useCallback(values => {
    dispatch(stepUpdate(values));
  }, []);
  
  const handleSubmit = useCallback(() => {
    dispatch(submit());
  }, []);
  const handleAppSysChange = useCallback(event => {
    dispatch(appSysChange(event));
  }, []);
  const handleOrgChange = useCallback(selectedOrganization => {
    dispatch(orgChange(selectedOrganization));
  }, []);
  const handleProgramChange = useCallback(selectedPrograms => {
    dispatch(programChange(selectedPrograms));
  }, []);
  const handleChangeSubmission = useCallback(() => {
    dispatch(changeSubmission());
  }, []);
  const handleChangePermission = useCallback((rowData, permission) => {
    dispatch(changePermission(rowData, permission));
  }, []);

  const {
    snackbarMessage,
    activeStep,
    searchKey,
    reference,
    organizationGroup,
    isSnackbarOpen,
    userOrganizations,
    userPrograms,
    userSubmissions,
    userPermissions,
    appSysOptions,
    organizationGroupOptions,
    organizationOptions,
    programOptions,
    ableToComplete,
  } = useSelector(
    ({
      UserRegistrationStore: {
        snackbarMessage,
        activeStep,
        searchKey,
        reference,
        organizationGroup,
        isSnackbarOpen,
        userOrganizations,
        userPrograms,
        userSubmissions,
        userPermissions,
        appSysOptions,
        organizationGroupOptions,
        organizationOptions,
        programOptions,
        ableToComplete,
      },
    }) => ({
      snackbarMessage,
      activeStep,
      searchKey,
      reference,
      organizationGroup,
      isSnackbarOpen,
      userOrganizations,
      userPrograms,
      userSubmissions,
      userPermissions,
      appSysOptions,
      organizationGroupOptions,
      organizationOptions,
      programOptions,
      ableToComplete,
    }),
    shallowEqual,
  );

  return (
    <div>
    {getStepContent(
        snackbarMessage,
        activeStep,
        searchKey,
        reference,
        organizationGroup,
        isSnackbarOpen,
        userOrganizations,
        userPrograms,
        userSubmissions,
        userPermissions,
        appSysOptions,
        organizationGroupOptions,
        organizationOptions,
        programOptions,
        ableToComplete,
        handleOrgGroupChange,
        handleBack,
        handleUpdate,
        handleSubmit,
        handleAppSysChange,
        handleOrgChange,
        handleProgramChange,
        handleChangeSubmission,
        handleChangePermission,
        props,
    )}
    </div>
  );
};

// Main function to export
const Register = () => {
  const handleSubmit = () => {};
  const dispatch = useDispatch();
  //retrieve userInfo

  const { registrationData } = useSelector(
    ({ UserRegistrationStore: { registrationData } }) => ({
      registrationData, 
    }),
    shallowEqual,
  );

//   const { registrationData } = useSelector(
//     state => ({
//       registrationData: selectFactoryRESTResponseTableValues(selectUserRegistrationStore)(state),
//     }),
//     shallowEqual,
//   );

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);
//   const { registrationData } = useSelector(
//     ({ UserRegistrationStore: { registrationData } }) => ({
//       registrationData, 
//     }),
//     shallowEqual,
//   );

  console.log(registrationData)

  return (
    <>
      {/* <SRIHeader/> */}
      <div className="register">
        <br />
        <Paper className="register__container">
          <Formik
            validationSchema={registerSchema}
            initialValues={registrationData}
            onSubmit={handleSubmit}
            render={formikProps => <Register_container {...formikProps} />}
          />
        </Paper>
      </div>
    </>
  );
};

// const ModifyUserInfo = props => (
//     <div className="modifyUserInfo">
//       <ModifyUserInfoHeader />
//       <ModifyUserInfoTable {...props} />
//     </div>
//   );

export default Register;