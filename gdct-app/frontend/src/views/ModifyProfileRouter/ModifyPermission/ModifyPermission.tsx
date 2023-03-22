import React, { lazy, useCallback, useMemo, useEffect, useState, ChangeEventHandler, ChangeEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Formik } from 'formik';
//@ts-ignore
import cloneDeep from 'clone-deep';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
//@ts-ignore
import Select from 'react-select';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
//@ts-ignore
import FilteredMultiSelect from 'react-filtered-multiselect';
import './ModifyPermission.scss';
//@ts-ignore
import * as yup from 'yup';
import MaterialTable from 'material-table';

import { useTranslation } from 'react-i18next';
//@ts-ignore
import Swal, { SweetAlertResult } from 'sweetalert2';
//@ts-ignore
import userRegistrationStore from '../../../store/UserRegistrationStore/store';
import {
  orgGroupChange,
  snackbarClose,
  stepBack,
  stepNext,
  submit,
  updatePermission,
  appSysChange,
  orgChange,
  programChange,
  changeSubmissionInModifyPermission,
  changePermission,
  searchOrganization,
  searchKeyChange,
  referenceChange,
  deleteUserPermission,
  loadModifyPermissionPage,
  //@ts-ignore
} from '../../../store/thunks/userRegistration';
import UserPermission from '../../../types/userpermission';
import Presubmission from '../../../types/presubmission';
import AppSys from '../../../types/appsys';
import Organization from '../../../types/organization';
import Program from '../../../types/program';
import OrganizationGroup from '../../../types/organizationgroup';
// Column for permission table.
const columns = [
  {
    title: 'Organization',
    render: (rowData:UserPermission) => `(${rowData.organization.id}) ${rowData.organization.name}`,
  },
  { title: 'Program', field: 'program.code' },
  { title: 'Submission', field: 'submission.name' },
  { title: 'Permission', field: 'permission' },
  { title: 'Status', field: 'status' },
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

// Button on the bottom of page
const ButtonBox = ({ activeStep, ableToComplete, handleBack, handleSubmit}:{
  activeStep:number;
  ableToComplete:boolean;
  handleBack:()=>void;
  handleSubmit:()=>void;

}) => (
  <Box border={1} color="primary" className="modifyPermission__buttonBox" justifyContent="center">
    <Button
      disabled={activeStep === 0}
      variant="outlined"
      color="primary"
      className="modifyPermission__buttonBack"
      onClick={handleBack}
    >
      Back
    </Button>

    <Button variant="outlined" color="primary" className="modifyPermission__button" href="/login">
      Cancel
    </Button>

    <Button
      disabled={!ableToComplete || activeStep !== 1}
      variant="outlined"
      color="primary"
      className="modifyPermission__button"
      onClick={handleSubmit}
    >
      UPDATE PERMISSION
    </Button>
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
  let selectedPrograms = [];
  let selectedOrganizations:object[] = [];
  return (
    <>
      <div className="modifyPermission__selectField">
        <Typography className="modifyPermission__inputTitle"> *Application </Typography>
        <Select
          name="appSys"
          options={appSysOptions}
          //@ts-ignore
          onChange={handleAppSysChange}
          className="modifyPermission__select"
        />
      </div>
      <div className="modifyPermission__selectField">
        <Typography className="modifyPermission__inputTitle">*Organization Groups</Typography>
        <Select
          name="organizations"
          options={organizationGroupOptions}
          //@ts-ignore
          onChange={handleOrgGroupChange}
          className="modifyPermission__select"
        />
      </div>

      <br />

      <div className="modifyPermission__multiSelectField">
        <Typography className="modifyPermission__inputTitle"> *Organizations </Typography>
        <FilteredMultiSelect
          onChange={handleOrgChange}
          options={organizationOptions}
          selectedOptions={selectedOrganizations}
          textProp="label"
          valueProp="value"
          buttonText="Add Organization"
          className="modifyPermission__filteredMultiSelect"
          showFilter={true}
          classNames={{
            button: 'modifyPermission__step3Button',
            select: 'modifyPermission__multiSelect',
          }}
        />
      </div>

      <div className="modifyPermission__multiSelectField">
        <Typography className="modifyPermission__inputTitle"> *Program</Typography>
        <FilteredMultiSelect
          onChange={handleProgramChange}
          options={programOptions}
          textProp="label"
          valueProp="value"
          buttonText="Add Program"
          className="modifyPermission__filteredMultiSelect"
          showFilter={true}
          classNames={{
            button: 'modifyPermission__step3Button',
            select: 'modifyPermission__multiSelect',
          }}
          selectedOptions={[]}
        />
      </div>
    </>
  );
};

// Have the detail UI page for each step
const getStepContent = (
  snackbarMessage:string,
  activeStep:number,
  searchKey:string,
  reference:string,
  organizationGroup:string,
  userOrganizations:object[],
  userPrograms:object[],
  userSubmissions:Presubmission[],
  userPermissions:UserPermission[],
  appSysOptions: AppSys[],
  organizationGroupOptions:OrganizationGroup[],
  organizationOptions:Organization[],
  programOptions:Program[],
  ableToComplete:boolean,
  handleOrgGroupChange:(event:ChangeEvent)=>void,
  handleBack:()=>void,
  handleSubmit:()=>void,
  handleAppSysChange:(event:ChangeEvent)=>void,
  handleOrgChange:(selectedOrganization:Organization)=>void,
  handleProgramChange:(selectedProgams:Program[])=>void,
  handleChangeSubmission:()=>void,
  handleChangePermission:(rowData:Presubmission,permission:string)=>void,
  props:any,
) => {
  const { values} = props;
  const [userSubmissionsLength, setSubmissionsLength] = useState(1);
  const [userPermissionsLength, setPermissionsLength] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    setSubmissionsLength(userSubmissions.length);
  }, [userSubmissions]);

  useEffect(() => {
    setPermissionsLength(userPermissions.length);
  }, [userPermissions]);

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
      filtering: true,
    };
  };

  const userSubmissionsOptions = useMemo(() => calculateOptions(userSubmissionsLength), [
    userSubmissionsLength,
  ]);
  const userPermissionsOptions = useMemo(() => calculateOptions(userPermissionsLength), [
    userPermissionsLength,
  ]);
  const onClickDelete = (_: any, rowData:UserPermission ) => {
    if (Array.isArray(rowData)) {
      return
    }
    console.log(rowData)
  }



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


  const deleteActions:any = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Delete The Permission', onClick: onClickDelete }], []);
  const { t, i18n } = useTranslation();
  const checkBoxColumns = [
    { title: 'Organization', field: 'organization.name' },
    { title: 'Program', field: 'program.code' },
    { title: 'Submission', field: 'submission.name' },
    {
      title: 'Approve*',
      field: 'approve',
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
  
  const submissionList = cloneDeep(userSubmissions);
  const permissionList = cloneDeep(userPermissions);
  console.log('permissionList', permissionList);
  return (
    <div className="modifyPermission__form">
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

      <div className="modifyPermission__tableContainer">
        <MaterialTable
        //@ts-ignore
          className="modifyPermission__table"
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
        className="modifyPermission__step3Button"
        onClick={handleChangeSubmission}
      >
        Add Submission
      </Button>
      <div className="modifyPermission__tableContainer">
        <MaterialTable
        //@ts-ignore
          className="modifyPermission__table"
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
          // actions={
          //   deleteActions
          // }
        />
        <ButtonBox
          activeStep={activeStep}
          handleBack={handleBack}
          ableToComplete={ableToComplete}
          handleSubmit={handleSubmit}

        />
      </div>
    </div>
  );
};

// Get the state and shown it on the website
const ModifyPermission_container = (props:any) => {
  const dispatch = useDispatch();
  const handleOrgGroupChange = useCallback((event: any) => {
    console.log(event)
    dispatch(orgGroupChange(event));
  }, []);

  const handleBack = useCallback(() => {
    dispatch(stepBack());
  }, []);
  // const handleNext = useCallback(values => {
  //   dispatch(stepNext(values));
  // }, []);
  const handleSubmit = useCallback(() => {
    dispatch(updatePermission());
    Swal.fire({
      title: 'Success!',
      text: 'Your request has been submitted',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    }).then((result:SweetAlertResult<any>) => {
      if (result.isConfirmed) {
        window.location.reload();
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
    dispatch(changeSubmissionInModifyPermission());
  }, []);
  const handleChangePermission = useCallback((rowData: any, permission: any) => {
    dispatch(changePermission(rowData, permission));
  }, []);

  let {
    snackbarMessage,
    activeStep,
    searchKey,
    reference,
    organizationGroup,
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
      //@ts-ignore
      UserRegistrationStore: {
        snackbarMessage,
        activeStep,
        searchKey,
        reference,
        organizationGroup,
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
  activeStep = 1;
  const organizationOptionsCopy = cloneDeep(organizationOptions);
  console.log('organizationOptionsCopy', organizationOptionsCopy);
  // organizationOptionsCopy.sort(function(a,b) {
  //   const LabelAStart = a.label.indexOf(")")+1
  //   const LabelBStart = b.label.indexOf(")")+1
  //   const LabelA = a.label.substring(LabelAStart,a.label.length).toLowerCase()
  //   const LabelB = b.label.substring(LabelBStart,b.label.length).toLowerCase()

  //   const compareArray = [LabelA,LabelB]
  //   compareArray.sort();
  //   return compareArray[0] == LabelA? -1 : 1
  // })
  organizationOptionsCopy.sort(function (a:{value:number}, b:{value:number}) {
    const compareArray = [a.value.toString(), b.value.toString()];
    compareArray.sort();
    return compareArray[0] == a.value.toString() ? -1 : 1;
  });

  return (
    <div>
      {getStepContent(
        snackbarMessage,
        activeStep,
        searchKey,
        reference,
        organizationGroup,
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

const SubmissionPermissionsHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Submission Permissions</Typography>
    </div>
  );
};

// Main function to export
const ModifyPermission = () => {
  const handleSubmit = () => {};
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadModifyPermissionPage());
  }, []);

  const { registrationData } = useSelector(
    //@ts-ignore
    ({ UserRegistrationStore: { registrationData } }) => ({
      registrationData,
    }),
    shallowEqual,
  );

  return (
    <div>
      <SubmissionPermissionsHeader/>
      <div className="modifyPermission">
        <br />
        <Paper className="modifyPermission__container">
          <Formik
            initialValues={registrationData}
            onSubmit={handleSubmit}
            render={formikProps => <ModifyPermission_container {...formikProps} />}
          />
        </Paper>
      </div>
    </div>
  );
};
export default ModifyPermission;
