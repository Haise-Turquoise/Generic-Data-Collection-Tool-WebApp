import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getAppResourcesRequest,
  createAppResourceRequest,
  deleteAppResourceRequest,
  updateAppResourceRequest,
} from '../../../store/thunks/AppResource';

import './AppResources.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { calculateOptions } from '../../../tools/misc'

const AppResourcesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Resource</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppResourcesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { appResources } = useSelector(
    state => ({
      appResources: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Resource Name', field: 'resourceName' },
      { title: 'Resource Path', field: 'resourcePath' },
      { title: 'Protection', field: 'isProtected' },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => (calculateOptions(readRowNum)), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appResource =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          appResource.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          appResource.timestamp = event.toLocaleString(); 
          dispatch(createAppResourceRequest(appResource, resolve, reject));
        }),
      onRowUpdate: appResource =>
        new Promise((resolve, reject) => {
          appResource.updatedBy=localStorage.getItem('currentUser')
          const event = new Date();
          appResource.timestamp = event.toLocaleString(); 
          dispatch(updateAppResourceRequest(appResource, resolve, reject));
        }),
      onRowDelete: appResource =>
        new Promise((resolve, reject) => {
          appResource.updatedBy=localStorage.getItem('currentUser')
          const event = new Date();
          appResource.timestamp = event.toLocaleString(); 
          dispatch(deleteAppResourceRequest(appResource._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    appResources.forEach(appResources => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(appResources.timestamp!=null) {

        // reformat date string to match ISO format of mongo db: 2021-02-16T03:59:32.015Z
        // const temptime = new Date(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,'')
        // );
        // const logtime = new Date(appRoles.timestamp);
        // console.log(appRoles.timestamp.toString().replace(/,/g,'').replace(/\./g,''));
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date(appResources.timestamp.toString());
       appResources.timestamp = event.toLocaleString(); 
      }
      else{
        // const logtime = new Date("2021-02-16T03:59:32.015Z");
        // appRoles.timestamp = logtime.toLocaleDateString("en-CA", timeOption);

       const event = new Date("2021-02-16T03:59:32.015Z");
       appResources.timestamp = event.toLocaleString();
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })

  useEffect(() => {
    dispatch(getAppResourcesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(appResources.length)}, [appResources]);

  return (
    <MaterialTable key={readRowNum} columns={columns} data={appResources} editable={editable} options={options} />
  );
};

const AppResources = props => {
  console.log('why not: ', props);
  return (
    <div className="AppResources">
      <AppResourcesHeader />
      {/* <FileDropzone/> */}
      <AppResourcesTable {...props} />
    </div>
  );
};

export default AppResources;
