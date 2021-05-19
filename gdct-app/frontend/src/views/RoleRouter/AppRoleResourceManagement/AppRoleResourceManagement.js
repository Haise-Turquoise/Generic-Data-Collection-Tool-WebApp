import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
import Loading from '../../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


import AppResourceList from '../AppResourceList'
import ProgramList from '../../OrganizationRouter/ProgramList';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { calculateOptions } from '../../../tools/misc';
//
import{selectAppRoleResourcesStore} from '../../../store/AppRoleResourcesStore/selectors';
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';

import {AppRoleResourcesStore} from '../../../store/AppRoleResourcesStore/store';
import {AppSysRolesStore} from '../../../store/AppSysRolesStore/store';
import {AppResourcesStore} from '../../../store/AppResourcesStore/store';
import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';
import { getAppResourcesRequest } from '../../../store/thunks/AppResource';
import {
    getAppRoleResourcesRequest,
    createAppRoleResourceRequest,
    deleteAppRoleResourceRequest,
    updateAppRoleResourceRequest,
  } from '../../../store/thunks/AppRoleResource';
const AppRoleResourceManagementHeader = ({
  match: {
    params: { _id },
  },
}) => {
  const [roleName, setRoleName] = useState('')
  let { appRoleResource } = useSelector(
    state => ({
      appRoleResource: (selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state).filter(
        elem => elem._id === _id,
      ) || [{}])[0],
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (appRoleResource) {
      setRoleName(appRoleResource.appSysRoleId.roleName)
    }
  }, [appRoleResource])

  return (
    <Paper className="header">
      <Typography variant="h5">App Role Resource Management</Typography>
      <Typography variant='body1'>{roleName}</Typography>
      {/* <HeaderActions/> */}
    </Paper>
    
  );
};

// Page Component Part 1
// const TemplateTypeTable = ({
//   match: {
//     params: { _id },
//   },
// }) => {
//   const dispatch = useDispatch();
//   const [readRowNum, setRowNum] = useState(1);

//   // Prepare the data for TemplateTypeTable
//   const { templateType } = useSelector(
//     state => ({
//       templateType: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
//         elem => elem._id === _id,
//       ) || [{}],
//     }),
//     shallowEqual,
//   );

//   // Prepare the columns for TemplateTypeTable
//   const columns = useMemo(
//     () => [
//       { title: 'Name', field: 'name' },
//       { title: 'Description', field: 'description' },
//       { title: 'Approvable', type: 'boolean', field: 'isApprovable' },
//       { title: 'Reviewable', type: 'boolean', field: 'isReviewable' },
//       { title: 'Submittable', type: 'boolean', field: 'isSubmittable' },
//       { title: 'Inputtable', type: 'boolean', field: 'isInputtable' },
//       { title: 'Viewable', type: 'boolean', field: 'isViewable' },
//       { title: 'Reportable', type: 'boolean', field: 'isReportable' },
//       { title: 'Active', type: 'boolean', field: 'isActive' },
//     ],
//     [],
//   );

//   useEffect(() => { setRowNum(templateType.length) }, [templateType])

//   const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

//   useEffect(() => {
//     dispatch(getTemplateTypesRequest());
//     return () => {
//       dispatch(TemplateTypesStore.actions.RESET());
//     };
//   }, [dispatch]);

//   return (
//     // @ts-ignore
//     <MaterialTable
//       key={readRowNum}
//       title="Current Template Type"
//       columns={columns}
//       data={templateType}
//       options={options}
//     />
//   );
// };

// ==================================================================================================
// Page Component Part 2 // from ProgramList from Organization
const LinkProgramTable = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getTemplateTypesRequest());
  //   return () => {
  //     dispatch(TemplateTypesStore.actions.RESET());
  //   };
  // }, [dispatch]);
  useEffect(() => {
    dispatch(getAppRoleResourcesRequest());
    dispatch(getAppSysRolesRequest());
    dispatch(getAppResourcesRequest());
    return () => {
      dispatch(AppResourcesStore.actions.RESET());
      dispatch(AppRoleResourcesStore.actions.RESET());
      dispatch(AppSysRolesStore.actions.RESET());
    };
  }, [dispatch]);

  // Prepare the data for LinkProgramTable
  // let { templateType } = useSelector(
  //   state => ({
  //     templateType: (selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
  //       elem => elem._id === _id,
  //     ) || [{}])[0],
  //   }),
  //   shallowEqual,
  // );

  let { appRoleResource } = useSelector(
    state => ({
      appRoleResource: (selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state).filter(
        elem => elem._id === _id,
      ) || [{}])[0],
    }),
    shallowEqual,
  );

  const reject = () => { alert('Missing or invalid parameters') };

  const onClickAdd = (_event, rowData) => {
    appRoleResource.resourceId = appRoleResource.resourceId.concat([{id:rowData._id, resourceName:rowData.resourceName}]);
    dispatch(updateAppRoleResourceRequest(appRoleResource, null, reject));
    // Refresh appRoleResource because dispatch makes object read-only, not allowing multiple adding.
    appRoleResource = Object.assign({}, appRoleResource);
  };

  const onClickDelete = (_event, rowData) => {
    appRoleResource.resourceId = appRoleResource.resourceId.filter(elem => elem.id !== rowData._id);
    dispatch(updateAppRoleResourceRequest(appRoleResource, null, reject));
    // Refresh appRoleResource because dispatch makes object read-only, not allowing multiple deleting.
    appRoleResource = Object.assign({}, appRoleResource);
  };
  
  const history = useHistory();
  const redirect = () => { history.push('/admin/role/app_role_resource_management') };
  
  return !appRoleResource ? (
    <Loading message={"Loading..."}/>
  ) : (
      <div>
        <AppResourceList
          resourceId={appRoleResource.resourceId}
          onClickAdd={onClickAdd}
          onClickDelete={onClickDelete}
        />
        <Button
          onClick={redirect} 
          variant="contained" 
          color="primary"
          style={{marginTop: '0.8%'}}
        >
          <ArrowBackIcon></ArrowBackIcon>
          Back
        </Button>
      </div>
    );
};


const AppRoleResourceManagement = props => (
  <div className="templateTypePage">
    <AppRoleResourceManagementHeader {...props} />
    
    <LinkProgramTable {...props} />
  </div>
);

export default AppRoleResourceManagement;