//@ts-ignore
import React, { lazy, useCallback, useMemo, useEffect, useState , ChangeEventHandler, ChangeEvent} from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Formik } from 'formik';
//@ts-ignore
import cloneDeep from 'clone-deep';
import Swal, { SweetAlertResult } from 'sweetalert2';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//@ts-ignore
import Select from 'react-select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
//@ts-ignore
import FilteredMultiSelect from 'react-filtered-multiselect';

import './Register.scss';
import Box from '@material-ui/core/Box';
//@ts-ignore
import * as yup from 'yup';
import MaterialTable from 'material-table';

import { useTranslation } from 'react-i18next';

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
  deleteUserPermission,
  //@ts-ignore
} from '../../store/thunks/userRegistration';
//@ts-ignore
import UserController from '../../controllers/user';

import Presubmission from '../../types/presubmission';
import UserPermission from '../../types/userpermission';
import AppSys from '../../types/appsys';
import Organization from '../../types/organization';
import Program from '../../types/program';
import OrganizationGroup from '../../types/organizationgroup';

interface PresubmissionMT extends Presubmission {
  tableData?: any;
}

function getSteps() {
  return ['Step1', 'Step2'];
}
const steps = getSteps();

// Column for permission table.
const columns = [
  // { title: 'Organization', field: 'organization.name' },
  {
    title: 'Organization',
    render: (rowData:UserPermission) => `(${rowData.organization.id}) ${rowData.organization.name}`,
  },
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

// The schema to validate user input
const registerSchema = () =>
  yup.object().shape({
    title: yup.string(),
    username: yup
      .string()
      .min(6, 'Username must be 6 to 20 characters long')
      .max(20, 'Username must be 6 to 20 characters long')
      .test('Unique Username', 'Username has already been used', async function (value:string | null | undefined) {
        const fetchData = await UserController.fetchUserByUserName(value || '');
        if (Object.keys(fetchData.user || {}).length === 0 && fetchData.user?.constructor === Object) {
          return true;
        }
        return false;
      })
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
      .oneOf([yup.ref('password'), undefined], 'Password should match with Verify Password')
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
      // .length(10, 'Please enter valid phone number')
      // .matches(/^[0-9]+$/, 'Please enter valid phone number')
      .matches(/\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/, 'Please enter valid phone number')
      .required('Please enter phone number'),
    email: yup
      .string()
      .email('Please enter a valid email')
      .max(254, 'Email is too long')
      .test('Unique Email', 'Email has already been used', async function (value:string | null | undefined) {
        const fetchData = await UserController.fetchUserByEmail(value || '');
        if (Object.keys(fetchData.user || {}).length === 0 && (fetchData.user == undefined || fetchData.user?.constructor === Object)) {
          return true;
        }
        return false;
      })
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
  touched,
  handleBack,
  handleNext,
  handleSubmit,
}:{
  activeStep:number;
  ableToComplete:boolean;
  values: object;
  isValid:boolean;
  touched:object;
  handleNext:(values:object)=>void;
  handleBack:()=>void;
  handleSubmit:()=>void;
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
      disabled={activeStep == 1 || !isValid || Object.keys(touched).length === 0}
      // disabled={activeStep == 1 || !isValid }
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
    <br />
    <br />
    <Typography className="register__subtext" >
    Please use the navigation buttons on this page to move between the registration steps. 
    Using the browser's Back and Forward buttons will remove the inputted information.
    </Typography>
  </Box>
);

// Read the information user select and ask controller to send request to backend
// After responsed from backend, page will be refreshed.
const selectOrgProgram = (
  searchKey:string,
  reference:string,
  organizationGroup:string,
  organizationOptions:Organization[],
  organizationGroupOptions:OrganizationGroup[],
  appSysOptions:AppSys[],
  programOptions:Program[],
  handleAppSysChange:(event:ChangeEvent)=>void,
  handleOrgGroupChange:(event:ChangeEvent)=>void,
  handleOrgChange:(selectedOrganization:Organization)=>void,
  handleProgramChange:(selectedProgams:Program[])=>void,
) => {
  //  if (organizationGroup !== "Health Service Providers") {
  const selectedPrograms:object[] = [];
  const selectedOrganizations:object[] = [];
  return (
    <div>
      <div className="register__selectField">
        <Typography className="register__inputTitle"> *Application </Typography>
        <Select
          name="appSys"
          id = "*Application"
          //@ts-ignore
          options={appSysOptions}
          //@ts-ignore
          onChange={handleAppSysChange}
          className="register__select"
        />
      </div>
      <div className="register__selectField">
        <Typography className="register__inputTitle">*Organization Groups</Typography>
        <Select
          name="organizations"
          id = "*Organization Groups"
          //@ts-ignore
          options={organizationGroupOptions}
          //@ts-ignore
          onChange={handleOrgGroupChange}
          className="register__select"
        />
      </div>

      <br />

      <div className="register__multiSelectField">
        <Typography className="register__inputTitle"> *Organizations </Typography>
        <FilteredMultiSelect
          onChange={handleOrgChange}
          options={organizationOptions}
          selectedOptions={selectedOrganizations}
          textProp="label"
          valueProp="value"
          buttonText="Add Organization"
          className="register__filteredMultiSelect"
          showFilter={true}
          classNames={{
            button: 'register__step3Button',
            select: 'register__multiSelect',
          }}
        />
      </div>

      <div className="register__multiSelectField">
        <Typography className="register__inputTitle"> *Program</Typography>
        <FilteredMultiSelect
          onChange={handleProgramChange}
          options={programOptions}
          selectedOptions={selectedPrograms}
          textProp="label"
          valueProp="value"
          buttonText="Add Program"
          className="register__filteredMultiSelect"
          showFilter={true}
          classNames={{
            button: 'register__step3Button',
            select: 'register__multiSelect',
          }}
        />
      </div>
    </div>
  );
};

// Have the detail UI page for each step
const getStepContent = (
  snackbarMessage:string,
  activeStep:number,
  searchKey:any,
  reference:any,
  organizationGroup:string,
  isSnackbarOpen:boolean,
  userOrganizations:Organization[],
  userPrograms:Program[],
  userSubmissions:Presubmission[],
  userPermissions:UserPermission[],
  appSysOptions:AppSys[],
  organizationGroupOptions:OrganizationGroup[],
  organizationOptions:Organization[],
  programOptions:Program[],
  ableToComplete:boolean,
  handleOrgGroupChange:(event:ChangeEvent)=>void,
  handleBack:()=>void,
  handleNext:(values:any)=>void,
  handleSubmit:()=>void,
  handleAppSysChange:(event:ChangeEvent)=>void,
  handleOrgChange:(selectedOrganization:Organization)=>void,
  handleProgramChange:(selectedPrograms:Program[])=>void,
  handleChangeSubmission:()=>void,
  handleChangePermission:(rowData:object, permission:string)=>void,
  props: any,
) => {
  const { values, handleChange, touched, handleBlur, errors, isValid } = props;
  const [userSubmissionsLength, setSubmissionsLength] = useState(1);
  const [userPermissionsLength, setPermissionsLength] = useState(1);
  const [maxPhoneLength, setMaxPhoneLength] = useState(10);
  const dispatch = useDispatch();
  useEffect(() => {
    setSubmissionsLength(userSubmissions.length);
  }, [userSubmissions]);

  useEffect(() => {
    setPermissionsLength(userPermissions.length);
  }, [userPermissions]);
  const editable = useMemo(
    () => ({
      isDeleteHidden: (userPermission: UserPermission) => {
        if (userPermission.appSys == 'unknown') {
          return false;
        }
        return true;
      },
      onRowDelete: (userPermission: UserPermission) =>
            new Promise<void>((resolve, reject) =>{
                setTimeout(() =>{
                    dispatch(deleteUserPermission(userPermission));
                    resolve();
                }, 1000);
      })
    }),
    [dispatch],
  );
  const calculateOptions = (itemCount:number) => {
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

  const calculateMaxLength = (value:string) => {
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

  const { t, i18n } = useTranslation();
  const checkBoxColumns = [
    { title: 'Organization', field: 'organization.name' },
    { title: 'Program', field: 'program.code' },
    { title: 'Submission', field: 'submission.name' },
    {
      title: 'Approve*',
      field: 'approve',
      // TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.approve}
          disabled={!rowData.approveAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'approve')}
          color="primary"
        />
      ),
    },
    {
      title: 'Review**',
      field: 'review',
      // TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.review}
          disabled={!rowData.reviewAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'review')}
          color="primary"
        />
      ),
    },
    {
      title: 'Submit***',
      field: 'submit',
      // TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.submit}
          disabled={!rowData.submitAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'submit')}
          color="primary"
        />
      ),
    },
    {
      title: 'Input****',
      field: 'input',
    // TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.input}
          disabled={!rowData.inputAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'input')}
          color="primary"
        />
      ),
    },
    {
      title: 'View*****',
      field: 'view',
      //TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.view}
          disabled={!rowData.viewAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'view')}
          color="primary"
        />
      ),
    },
    {
      title: 'View Cognos******',
      field: 'viewCognos',
      // TO-FIX
      render: (rowData:Presubmission) => (
        <Checkbox
          checked={rowData.Reporter}
          disabled={!rowData.viewCognosAvailable}
          // @ts-ignore
          onChange={handleChangePermission.bind(this, rowData, 'viewCognos')}
          color="primary"
        />
      ),
    },
  ];

  switch (activeStep) {
    case 0:
      // const {t, i18n} = useTranslation();
      return (
        <div>
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
              activeStep={activeStep}
              ableToComplete={ableToComplete}
              values={values}
              isValid={isValid}
              touched = {touched}
              handleSubmit={handleSubmit}
              handleBack={handleBack}
              handleNext={handleNext}
            />
          </form>
        </div>
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
            // @ts-ignore
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
            // @ts-ignore
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
              options={{...userPermissionsOptions,actionsColumnIndex: 0,}}
              style={{
                backgroundColor: '#f2f5f7',
              }}
              data={permissionList}
              editable={editable}
            />
            <ButtonBox
              activeStep={activeStep}
              handleBack={handleBack}
              handleNext={handleNext}
              ableToComplete={ableToComplete}
              handleSubmit={handleSubmit}
              values={values}
              touched = {touched}
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
const Register_container = (props: any) => {
  console.log(props)
  const dispatch = useDispatch();
  const history = useHistory();
  const handleOrgGroupChange = useCallback((event: any) => {
    dispatch(orgGroupChange(event));
  }, []);
  const handleSnackbarClose = useCallback(() => {
    dispatch(snackbarClose());
  }, []);
  const handleBack = useCallback(() => {
    dispatch(stepBack());
  }, []);
  const handleNext = useCallback((values: any) => {
    dispatch(stepNext(values));
  }, []);
  const handleSubmit = useCallback(() => {
    dispatch(submit());
    Swal.fire({
      title: 'Success!',
      text: 'Your request has been submitted',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then((result:SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        // window.location.reload();
        history.push('/');
      }
    });
  }, []);
  const handleAppSysChange = useCallback((event: any) => {
    dispatch(appSysChange(event));
  }, []);
  const handleOrgChange = useCallback((selectedOrganization: any) => {
    dispatch(orgChange(selectedOrganization));
  }, []);
  const handleProgramChange = useCallback((selectedPrograms: any) => {
    dispatch(programChange(selectedPrograms));
  }, []);
  const handleChangeSubmission = useCallback(() => {
    dispatch(changeSubmission());
  }, []);
  const handleChangePermission = useCallback((rowData: any, permission: any) => {
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
      // @ts-ignore
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
  const organizationOptionsCopy = cloneDeep(organizationOptions);
  organizationOptionsCopy.sort(function (a:{value:number}, b:{value:number}) {
    const compareArray = [a.value.toString(), b.value.toString()];
    compareArray.sort();
    return compareArray[0] == a.value.toString() ? -1 : 1;
  });
  // console.log('organizationOptionsCopy', organizationOptionsCopy)
  // organizationOptionsCopy.sort(function(a,b) {
  //   const LabelAStart = a.label.indexOf(")")+1
  //   const LabelBStart = b.label.indexOf(")")+1
  //   const LabelA = a.label.substring(LabelAStart,a.label.length).toLowerCase()
  //   const LabelB = b.label.substring(LabelBStart,b.label.length).toLowerCase()
  //   // console.log(LabelA,LabelB)
  //   const compareArray = [LabelA,LabelB]
  //   compareArray.sort();
  //   return compareArray[0] == LabelA? -1 : 1
  // })
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
              organizationOptionsCopy,
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

// Main function to export
const Register = () => {
  const handleSubmit = () => {};
  const dispatch = useDispatch();
  const { registrationData } = useSelector(
    // @ts-ignore
    ({ UserRegistrationStore: { registrationData } }) => ({
      registrationData,
    }),
    shallowEqual,
  );

  return (
    <div>
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
    </div>
  );
};
export default Register;
