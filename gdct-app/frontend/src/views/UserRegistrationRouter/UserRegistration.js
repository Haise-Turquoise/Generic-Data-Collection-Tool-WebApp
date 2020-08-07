import React, { lazy, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Formik } from 'formik';
import cloneDeep from 'clone-deep';

// import SRIHeader from "../../../SRI_Header"

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

import './Register.scss';
import Box from '@material-ui/core/Box';
import * as yup from 'yup';
import MaterialTable from 'material-table';
import { selectUserRegistrationStore } from '../../store/UserRegistrationStore/selectors';
import UserRegistrationStore from '../../store/UserRegistrationStore/store';
import { updateSubmissionExcelRequest } from '../../store/thunks/submission';

import {
  orgGroupChange,
  snackbarClose,
  stepBack,
  stepNext,
  submit,
  appSysChange,
  orgChange,
  programChange,
  changeSubmission,
  changePermission,
  searchOrganization,
  searchKeyChange,
  referenceChange,
} from '../../store/thunks/userRegistration';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { ROUTE_PUBLIC_LOGIN } from '../../constants/routes';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';

function getSteps() {
  return ['Step1', 'Step2'];
}
const steps = getSteps();

const titleOptions = [
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Dr.', value: 'Dr.' },
];

const columns = [
  { title: 'Organization', field: 'organization.name' },
  { title: 'Program', field: 'program.code' },
  { title: 'Submission', field: 'submission.name' },
  { title: 'Permission', field: 'permission' },
  {
    title: 'Authoritative Person Name',
    field: 'organization.authorizedPerson.name',
  },
  {
    title: "Authoritative Person's Phone Number",
    field: 'organization.authorizedPerson.phone',
  },
  {
    title: "Authoritative Person's Email",
    field: 'organization.authorizedPerson.email',
  },
];

const searchKeyOptions = [
  { label: 'Organization Code', value: 'code' },
  { label: 'Organization Name', value: 'name' },
  { label: 'Location Name', value: 'LocationName' },
];

const registerSchema = yup.object().shape({
  title: yup.string().required('Please select one title'),
  username: yup
    .string()
    .min(6, 'Username must be 6 to 20 characters long')
    .max(20, 'Username must be 6 to 20 characters long')
    .required('Please enter a username'),
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
    .oneOf([yup.ref('password'), null], 'Password should match with Verify Password')
    .required('Please confirm your password'),
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
    .length(10, 'Please enter valid phone number')
    .matches(/^[0-9]+$/, 'Please enter valid phone number')
    .required('Please enter phone number'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .max(254, 'Email is too long')
    .required('Please enter your email'),
  ext: yup.string().max(100, 'Ext is too long'),
});

const ButtonBox = ({
  activeStep,
  ableToComplete,
  values,
  isValid,
  handleBack,
  handleNext,
  handleSubmit,
}) => (
  <Box border={1} color="primary" className="register__buttonBox" justifyContent="center">
    <Button
      disabled={activeStep === 0}
      variant="outlined"
      color="primary"
      className="register__buttonBack"
      onClick={handleBack}
    >
      Back
    </Button>

    <Button variant="outlined" color="primary" className="register__button" href="/login">
      Cancel
    </Button>

    <Button
      disabled={activeStep == 1 || !isValid}
      variant="outlined"
      color="primary"
      className="register__button"
      onClick={() => handleNext(values)}
    >
      Next
    </Button>

    <Button
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
    </Typography>
  </Box>
);

const selectOrgProgram = (
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
) => {
  //  if (organizationGroup !== "Health Service Providers") {
  const selectedPrograms = [];
  const selectedOrganizations = [];
  console.log(appSysOptions);
  return (
    <>
      <Typography className="register__inputTitle"> *AppSys </Typography>
      <Select
        name="appSys"
        options={appSysOptions}
        onChange={handleAppSysChange}
        className="register__select"
      />

      <Typography className="register__inputTitle">*OrganizationsGroups</Typography>
      <Select
        name="organizations"
        options={organizationGroupOptions}
        onChange={handleOrgGroupChange}
        className="register__select"
      />
      <br />
      <Typography className="register__inputTitle"> *Organizations </Typography>

      <FilteredMultiSelect
        onChange={handleOrgChange}
        options={organizationOptions}
        selectedOptions={selectedOrganizations}
        textProp="label"
        valueProp="value"
        buttonText="Add Organization"
        className="register__filteredMultiSelect"
        showFilter={false}
        classNames={{
          button: 'register__step3Button',
          select: 'register__multiSelect',
        }}
      />

      <Typography className="register__inputTitle"> *Program </Typography>

      <FilteredMultiSelect
        onChange={handleProgramChange}
        options={programOptions}
        selectedOptions={selectedPrograms}
        textProp="label"
        valueProp="value"
        buttonText="Add Program"
        className="register__filteredMultiSelect"
        showFilter={false}
        classNames={{
          button: 'register__step3Button',
          select: 'register__multiSelect',
        }}
      />
    </>
  );
};

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
  handleNext,
  handleSubmit,
  handleAppSysChange,
  handleOrgChange,
  handleProgramChange,
  handleChangeSubmission,
  handleChangePermission,
  props,
) => {
  const { values, handleChange, touched, handleBlur, errors, isValid } = props;
  const checkBoxColumns = [
    { title: 'Organization', field: 'organization.name' },
    { title: 'Program', field: 'program.code' },
    { title: 'Submission', field: 'submission.name' },
    {
      title: 'Approve*',
      field: 'approve',
      render: rowData => (
        <Checkbox
          checked={rowData.approve}
          disabled={!rowData.approveAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'approve')}
          color="primary"
        />
      ),
    },
    {
      title: 'Review**',
      field: 'review',
      render: rowData => (
        <Checkbox
          checked={rowData.review}
          disabled={!rowData.reviewAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'review')}
          color="primary"
        />
      ),
    },
    {
      title: 'Submit***',
      field: 'submit',
      render: rowData => (
        <Checkbox
          checked={rowData.submit}
          disabled={!rowData.submitAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'submit')}
          color="primary"
        />
      ),
    },
    {
      title: 'Input****',
      field: 'input',
      render: rowData => (
        <Checkbox
          checked={rowData.input}
          disabled={!rowData.inputAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'input')}
          color="primary"
        />
      ),
    },
    {
      title: 'View*****',
      field: 'view',
      render: rowData => (
        <Checkbox
          checked={rowData.view}
          disabled={!rowData.viewAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'view')}
          color="primary"
        />
      ),
    },
    {
      title: 'View Cognos******',
      field: 'viewCognos',
      render: rowData => (
        <Checkbox
          checked={rowData.Reporter}
          disabled={!rowData.viewCognosAvailable}
          onChange={handleChangePermission.bind(this, rowData, 'viewCognos')}
          color="primary"
        />
      ),
    },
  ];

  switch (activeStep) {
    case 0:
      return (
        <>
          <form className="register__form">
            <br />
            <div className="register__label">
              <Typography className="register__inputTitle"> *Title </Typography>
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
                    height: 30,
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
                    height: 30,
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
                    height: 30,
                  },
                }}
              />
            </div>

            <br />
            <div className="register__label">
              <Typography className="register__inputTitle"> *Phone Number </Typography>
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
                    height: 30,
                  },
                }}
              />
            </div>
            <div className="register__label">
              <Typography className="register__inputTitle"> Ext. </Typography>
            </div>
            <div className="register__informationField">
              <TextField
                variant="outlined"
                className="register__field"
                id="Ext."
                name="Ext."
                type="Ext."
                value={values.ext}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  style: {
                    height: 30,
                  },
                }}
              />
            </div>
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
                    height: 30,
                  },
                }}
              />
            </div>
            <br />
            <div className="register__label">
              <Typography className="register__inputTitle"> *User ID </Typography>
            </div>
            <div className="register__informationField">
              <TextField
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
                    height: 30,
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
                value={values.password}
                onChange={handleChange}
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                onBlur={handleBlur}
                InputProps={{
                  style: {
                    height: 30,
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
                    height: 30,
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
              handleNext={handleNext}
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
              columns={checkBoxColumns}
              options={{
                toolbar: false,
                showTitle: false,
                headerStyle: {
                  backgroundColor: '#f2f5f7',
                },
              }}
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
              columns={columns}
              options={{
                toolbar: false,
                showTitle: false,
                headerStyle: {
                  backgroundColor: '#f2f5f7',
                },
              }}
              style={{
                backgroundColor: '#f2f5f7',
              }}
              actions={
                [
                  // {
                  //   icon: 'delete',
                  //   tooltip: 'Delete Permission',
                  //   onClick: (event, rowData) => {
                  //     let editedPermission = userPermissions;
                  //     editedPermission.splice(rowData.tableData.id, 1);
                  //     setUserPermissionList(editedPermission);
                  //   }
                  // }
                ]
              }
              components={
                {
                  // Action: props => (
                  //   <Button
                  //     onClick={(event) => props.action.onClick(event, props.data)}
                  //     color="primary"
                  //     variant="outlined"
                  //     style={{textTransform: 'none'}}
                  //     size="small"
                  //   >
                  //     Delete
                  //   </Button>
                  // )
                }
              }
              data={permissionList}
              // editable={editable} options={options}
            />
            <ButtonBox
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
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
  const handleNext = useCallback(values => {
    dispatch(stepNext(values));
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
      <Stepper className="register__stepper" activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography>All steps completed - you&apos;re finished</Typography>
          </div>
        ) : (
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
              handleNext,
              handleSubmit,
              handleAppSysChange,
              handleOrgChange,
              handleProgramChange,
              handleChangeSubmission,
              handleChangePermission,
              props,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const handleSubmit = () => {};

  const { registrationData } = useSelector(
    ({ UserRegistrationStore: { registrationData } }) => ({
      registrationData,
    }),
    shallowEqual,
  );

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
export default Register;
