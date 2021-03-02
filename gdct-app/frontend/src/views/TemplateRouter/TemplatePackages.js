import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';

import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { cloneDeep } from 'lodash';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
import { selectTemplatePackagesStore } from '../../store/TemplatePackagesStore/selectors';
import {
  getTemplatePackagesRequest,
  createTemplatePackageRequest,
  deleteTemplatePackageRequest,
  updateTemplatePackageRequest,
} from '../../store/thunks/templatePackage';
import { ROUTE_TEMPLATE_PCKGS_PCKGS } from '../../constants/routes';
import { TemplatePackagesStoreActions } from '../../store/TemplatePackagesStore/store';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
import { getStatusesRequest } from '../../store/thunks/status';
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';
import StatusesStore from '../../store/StatusesStore/store';
import SubmissionPeriodsStore from '../../store/SubmissionPeriodsStore/store';
import ErrorBanner from '../ErrorBanner';
import { calculateOptions } from '../../tools/misc'

const TemplatePackageHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Package</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatePackages = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [readRowNum, setRowNum] = useState(1);

  const {
    templatePackages,
    lookupStatuses,
    lookupSubmissionPeriods,
    WholeLookupStatuses,
  } = useSelector(
    state => ({
      isCallInProgress: selectFactoryRESTIsCallInProgress(selectTemplatePackagesStore)(state),
      templatePackages: selectFactoryRESTResponseTableValues(selectTemplatePackagesStore)(state),
      lookupStatuses: selectFactoryRESTLookup(selectStatusesStore)(state),
      lookupSubmissionPeriods: selectFactoryRESTLookup(selectSubmissionPeriodsStore)(state),
      WholeLookupStatuses: selectFactoryRESTResponseTableValues(selectStatusesStore)(state),
    }),
    shallowEqual,
  );
  // console.log('templatespackages', templatePackages);
  // console.log('WholeLookupStatuses', WholeLookupStatuses);
  // console.log('lookupStatuses', lookupStatuses)
  // console.log('lookupSubmissionPeriods', lookupSubmissionPeriods)

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Package',
        onClick: (_event, pckg) => history.push(`${ROUTE_TEMPLATE_PCKGS_PCKGS}/${pckg._id}`),
      },
    ],
    [dispatch],
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'Submission Period ID',
        field: 'submissionPeriodId',
        lookup: lookupSubmissionPeriods,
      },
      // { title: "TemplateIds", type: "boolean", field: "templateIds" },
      {
        title: 'Status ID',
        field: 'statusId',
        lookup: lookupStatuses,

        editComponent: props => {
          const optionList = [];
          for (const key in props.columnDef.lookup) {
            optionList.push({
              value: key,
              label: props.columnDef.lookup[key],
            });
          }

          const optionListForPackage = [];
          WholeLookupStatuses.forEach(status => {
            if (status.forPackage) {
              optionListForPackage.push({
                value: status._id,
                label: status.name,
              });
            }
          });
          function isEmpty(obj) {
            return Object.keys(obj).length === 0;
          }
          if (isEmpty(props.rowData) || !props.rowData.templateIds) {
            // console.log(WholeLookupStatuses)
            WholeLookupStatuses.forEach(status => {
              status.name == 'in progress' ? (props.rowData.statusId = status._id) : {};
            });
            return <div>in progress</div>;
          }
          if (props.rowData.templateIds.length == 0 || props.rowData.programIds.length == 0) {
            // console.log('forPackage');
            const optionInProgress = [];
            WholeLookupStatuses.forEach(status => {
              status.name == 'in progress'
                ? optionInProgress.push({ value: status._id, label: status.name })
                : {};
            });
            // console.log(optionInProgress)

            return (
              <Select
                onChange={data => {
                  props.onChange(data.value);
                }}
                // options={optionListForPackage}/>
                // options={[{ value: '5fc53f2af05fb45fed6c88b1', label: 'in progress' }]}
                options={optionInProgress}
              />
            );
          }
          return (
            <Select
              onChange={data => {
                props.onChange(data.value);
              }}
              options={optionListForPackage}
            />
          );

          // return <Select  options={optionList}/>
        },
      },
      {
        title: 'Creation Date',
        field: 'timestamp',
      },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [lookupStatuses, lookupSubmissionPeriods],
  );

  const options = useMemo(
    () => calculateOptions(readRowNum),
    [readRowNum],
  );

  const editable = useMemo(
    () => ({
      onRowAdd: templatePackage =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          templatePackage.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          templatePackage.timestamp = event.toLocaleString(); 
          templatePackage = { ...templatePackage, templateIds: [], programIds: [] };
          dispatch(createTemplatePackageRequest(templatePackage, resolve, reject));
        }),
      onRowUpdate: templatePackage =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          templatePackage.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          templatePackage.timestamp = event.toLocaleString(); 
          // console.log(templatePackage);
          dispatch(updateTemplatePackageRequest(templatePackage, resolve, reject));
        }),
      onRowDelete: templatePackage =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          templatePackage.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          templatePackage.timestamp = event.toLocaleString(); 
          dispatch(deleteTemplatePackageRequest(templatePackage._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    templatePackages.forEach(templatePackages => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(templatePackages.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(templatePackages.timestamp.toString());
       templatePackages.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       templatePackages.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

  useEffect(() => {
    dispatch(getTemplatePackagesRequest());
    dispatch(getStatusesRequest());
    dispatch(getSubmissionPeriodsRequest());

    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
      dispatch(StatusesStore.actions.RESET());
      dispatch(SubmissionPeriodsStore.actions.RESET());
    };
  }, [dispatch]);

  useEffect(()=>{setRowNum(templatePackages.length)}, [templatePackages])

  return (
    <div>
      <TemplatePackageHeader />
      <ErrorBanner title={"You cannot delete the selected template package since it was already published"} targetStore={selectTemplatePackagesStore}/>
      <MaterialTable
        key={readRowNum}
        columns={columns}
        data={templatePackages}
        editable={editable}
        options={options}
        actions={actions}
      />
    </div>
  );
};

export default TemplatePackages;
