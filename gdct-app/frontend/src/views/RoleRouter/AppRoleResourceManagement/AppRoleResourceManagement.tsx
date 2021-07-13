import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
//@ts-ignore
import Loading from '../../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
//@ts-ignore
import Loading from '../../../components/Loading';

import AppResourceList from '../AppResourceList';
import ProgramList from '../../OrganizationRouter/ProgramList';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  //@ts-ignore
} from '../../../tools/misc';
//
//@ts-ignore
import{selectAppRoleResourcesStore} from '../../../store/AppRoleResourcesStore/selectors';
//@ts-ignore
import { selectAppSysRolesStore } from '../../../store/AppSysRolesStore/selectors';
//@ts-ignore
import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';

//@ts-ignore
import {AppRoleResourcesStore} from '../../../store/AppRoleResourcesStore/store';
//@ts-ignore
import {AppSysRolesStore} from '../../../store/AppSysRolesStore/store';
//@ts-ignore
import {AppResourcesStore} from '../../../store/AppResourcesStore/store';
//@ts-ignore
import { getAppSysRolesRequest } from '../../../store/thunks/AppSysRole';
//@ts-ignore
import { getAppResourcesRequest } from '../../../store/thunks/AppResource';
import {
    getAppRoleResourcesRequest,
    createAppRoleResourceRequest,
    deleteAppRoleResourceRequest,
    updateAppRoleResourceRequest,
//@ts-ignore
  } from '../../../store/thunks/AppRoleResource';
//@ts-ignore
import AppRoleResourceController from '../../../controllers/AppRoleResource'
//@ts-ignore
import AppSysRoleController from '../../../controllers/AppSysRole'
//@ts-ignore
import AppResourceController from '../../../controllers/AppResource'

import AppRoleResource from '../../../types/approleresource';
import AppResource from '../../../types/appresource';
import { AxiosResponse } from 'axios';
type propType = { _id: string }

const AppRoleResourceManagementHeader = ({
  match: {
    params: { _id },
  },
}: RouteComponentProps<propType>) => {
  const [roleName, setRoleName] = useState('')
  let { appRoleResource }: { appRoleResource: AppRoleResource } = useSelector(
    state => ({
      appRoleResource: (selectFactoryRESTResponseTableValues(selectAppRoleResourcesStore)(state).filter(
        (elem: AppRoleResource) => elem._id === _id,
      ) || [{}])[0],
    }),
    shallowEqual,
  );

  useEffect(() => {
    if (appRoleResource) {
      setRoleName(
        typeof appRoleResource.appSysRoleId === 'string' ? 
        appRoleResource.appSysRoleId : 
        appRoleResource.appSysRoleId.roleName
      )
    }
  }, [appRoleResource]);

  return (
    <Paper className="header">
      <Typography variant="h5">App Role Resource Management</Typography>
      <Typography variant="body1">{roleName}</Typography>
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
}: RouteComponentProps<propType>) => {
  const dispatch = useDispatch();
  const [appRoleResource, setAppRoleResource] =
    useState<AppRoleResource | undefined>(undefined)

  useEffect(() => {
    AppRoleResourceController.fetchAppRoleResource(_id)
      .then((res: AppRoleResource | undefined) => {
        console.log(res)
        if (res) {
          setAppRoleResource(res)
        }
      })
  }, [])
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

  const reject = () => { alert('Missing or invalid parameters') };

  const onClickAdd = (_: any, rowData: AppResource | AppResource[]) => {
    if (Array.isArray(rowData) || !appRoleResource) {
      return
    }
    setAppRoleResource(prev => {
      const copy: AppRoleResource = {...prev!}
      copy.resourceId = copy.resourceId.concat([{id: rowData._id, resourceName: rowData.resourceName}])
      AppRoleResourceController.update(copy)
      return copy
    })
    // dispatch(updateAppRoleResourceRequest(appRoleResource, null, reject));
    // // Refresh appRoleResource because dispatch makes object read-only, not allowing multiple adding.
    // appRoleResource = Object.assign({}, appRoleResource);
  };

  const onClickDelete = (_: any, rowData: AppResource | AppResource[]) => {
    if (Array.isArray(rowData) || !appRoleResource) {
      return
    }
    const appRoleResCopy: AppRoleResource = {...appRoleResource}
    appRoleResCopy.resourceId = appRoleResCopy.resourceId.filter(elem => elem.id !== rowData._id);
    AppRoleResourceController.update(appRoleResCopy).then((res: AxiosResponse) => {
      if (res.status === 200) {
        setAppRoleResource(appRoleResCopy)
      }
    })
    setAppRoleResource(prev => {
      const copy: AppRoleResource = {...prev!}
      copy.resourceId = copy.resourceId.filter(elem => elem.id !== rowData._id)
      AppRoleResourceController.update(copy)
      return copy
    })
    // dispatch(updateAppRoleResourceRequest(appRoleResource, null, reject));
    // // Refresh appRoleResource because dispatch makes object read-only, not allowing multiple deleting.
    // appRoleResource = Object.assign({}, appRoleResource);
  };

  const history = useHistory();
  const redirect = () => {
    history.push('/admin/role/app_role_resource_management');
  };

  return !appRoleResource ? (
    <Loading message={'Loading...'} />
  ) : (
    <div>
      <AppResourceList
        resourceId={appRoleResource.resourceId}
        onClickAdd={onClickAdd}
        onClickDelete={onClickDelete}
      />
      <Button onClick={redirect} variant="contained" color="primary" style={{ marginTop: '0.8%' }}>
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
    </div>
  );
};


const AppRoleResourceManagement = (props: RouteComponentProps<propType>) => (
  <div className="templateTypePage">
    <AppRoleResourceManagementHeader {...props} />

    <LinkProgramTable {...props} />
  </div>
);

export default AppRoleResourceManagement;
