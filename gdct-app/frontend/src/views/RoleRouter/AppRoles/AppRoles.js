import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getAppRolesRequest,
  createAppRoleRequest,
  deleteAppRoleRequest,
  updateAppRoleRequest,
} from '../../../store/thunks/AppRole';

import './AppRoles.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectAppRolesStore } from '../../../store/AppRolesStore/selectors';
import { calculateOptions } from '../../../tools/misc'

const AppRolesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Application Role</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppRolesTable = () => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const { appRoles } = useSelector(
    state => ({
      appRoles: selectFactoryRESTResponseTableValues(selectAppRolesStore)(state),
    }),
    shallowEqual,
  );

//  const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };

  const columns = useMemo(
    () => [
      { title: 'Code', field: 'code' },
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp', type: Date,
        editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: appRole =>
        new Promise((resolve, reject) => {console.log (appRole)
          appRole.updatedBy=localStorage.getItem('currentUser')
          dispatch(createAppRoleRequest(appRole, resolve, reject));
        }),
      onRowUpdate: appRole =>
        new Promise((resolve, reject) => {
          appRole.updatedBy=localStorage.getItem('currentUser')
          dispatch(updateAppRoleRequest(appRole, resolve, reject));
        }),
      onRowDelete: appRole =>
        new Promise((resolve, reject) => {
          appRole.updatedBy=localStorage.getItem('currentUser')
          dispatch(deleteAppRoleRequest(appRole._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

//  console.log(appRoles)
    // Convert Date format
    const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
    appRoles.forEach(appRoles => {
//        appRole.timestamp = new Date()
//      var date = moment(appRoles.timestamp).toDate();
      if(appRoles.timestamp!=null) {
        const event = new Date(appRoles.timestamp.toString());
        appRoles.timestamp = event.toLocaleString(); 
      }
      else{
        const event = new Date("2021-02-16T03:59:32.015Z");
        appRoles.timestamp = event.toLocaleString(); 
      }
      // const event = new Date(appRoles.timestamp.toString());
      // console.log(appRoles.timestamp.toString());
      // const logtime = new Date(appRoles.timestamp); 
      // appRoles.timestamp = event.toLocaleDateString("en-CA", timeOption); 
    })
    console.log(appRoles)
  useEffect(() => {
    dispatch(getAppRolesRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(appRoles.length)}, [appRoles])

  return <MaterialTable key={readRowNum} columns={columns} data={appRoles} editable={editable} options={options} />;
};

const AppRoles = props => {
  console.log('why not: ', props);
  return (
    <div className="AppRoles">
      <AppRolesHeader />
      {/* <FileDropzone/> */}
      <AppRolesTable {...props} />
    </div>
  );
};

export default AppRoles;
