import React, { useMemo, useEffect, useState, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import MaterialTable, { Action, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
//@ts-ignore
import cloneDeep from 'clone-deep';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryValueById,
} from '../../store/common/REST/selectors';
import { ModifyUserInfoStoreActions } from '../../store/ModifyUserInfo/store';
//@ts-ignore
import { calculateOptions } from '../../tools/misc';
import {
  getUserInfoPopulatedRequest,
  updateUserInfoRequest,
  approvePermission,
  rejectPermission,
//@ts-ignore
} from '../../store/thunks/ModifyUserInfo';

import UserController from '../../controllers/user';
import usersController from '../../controllers/Users';
import CreateAuditLog from '../AuditLog_Global';

import { selectModifyUserInfoStore } from '../../store/ModifyUserInfo/selectors';
import { state } from '../../store/types';
import User, { ToBeApproved } from '../../types/user';

const Header = () => (
  <div className="d-flex justify-content-between p-2 mb-3">
    <Typography variant="h5">Request Management</Typography>
  </div>
);

const RequestManagementTable = () => {
  const dispatch = useDispatch();
  const userID = localStorage.getItem('currentUserID') || '';
  const email = localStorage.getItem('currentUser');
  const [readRowNum, setRowNum] = useState(1);

  const { user } = useSelector((state: state) => {
    const user = selectFactoryValueById(selectModifyUserInfoStore)(userID)(state);
    return { user };
  }, shallowEqual);
  // // Convert Date format
  // statuses.forEach(status => {
  //   // will work if this is needer, import formatTimestamp from tools
  //   status.updatedAt = formatTimestamp(status.updatedAt)
  // });
  let toBeApproved = [];
  if (user && user.toBeApproved) {
    toBeApproved = cloneDeep(user.toBeApproved);
  }
  // const toBeApproved = user? cloneDeep(user.toBeApproved):[];
  const onClickApprove = async (_event: MouseEvent, rowData: ToBeApproved | ToBeApproved[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    const applierUser = await usersController.fetchByEmail(rowData.applierEmail);
     CreateAuditLog(email, 'Approve Request', 'Request Management',null,{},{});
    return new Promise((resolve, reject) => {
      if (applierUser) {
        dispatch(approvePermission(rowData, applierUser, user, resolve, reject));
      }
    });
  };

  const onClickReject = async (_event: MouseEvent, rowData: ToBeApproved | ToBeApproved[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    const applierUser = await usersController.fetchByEmail(rowData.applierEmail);
    CreateAuditLog(email, 'Reject Request', 'Request Management',null,{},{});
    return new Promise((resolve, reject) => {
      if (applierUser) {
        dispatch(rejectPermission(rowData, applierUser, user, resolve, reject));
      }
    });
  };

  const approve_actions: Action<ToBeApproved> = {
    icon: ThumbUpIcon,
    tooltip: 'Approve Request',
    onClick: onClickApprove,
  };

  const reject_actions: Action<ToBeApproved> = { icon: ThumbDownIcon, tooltip: 'Reject Request', onClick: onClickReject };
  // Prepare the columns for material table
  const columns = useMemo(
    () => [
      { title: 'Applicant Email', field: 'applierEmail' },
      { title: 'AppSys Role', render: (rowData: ToBeApproved) => `${rowData.appSys}- ${rowData.permission}` },
      {
        title: 'Organization',
        render: (rowData: ToBeApproved) => `(${rowData.organization.id}) ${rowData.organization.name}`,
      },
      { title: 'Program', field: 'program.name' },
      { title: 'Template', field: 'submission.name' },
    ],
    [],
  );

  const options: Options<ToBeApproved> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
  // function recordUpdate(status) {
  //   //get username and record in Modified By column
  //   status.updatedBy = localStorage.getItem('currentUser');
  //   //record new date and time in Modified On column
  //   status.updatedAt = new Date().toLocaleString();
  // }
  // Prepare the editing functionalities for the material table

  useEffect(() => {
    if (email) {
      console.log('Page refresh');
      dispatch(getUserInfoPopulatedRequest(email));
    }
    return () => {
      dispatch(ModifyUserInfoStoreActions.RESET(''));
    };
  }, [dispatch]);

  useEffect(() => {
    setRowNum(toBeApproved.length);
  }, [toBeApproved]);

  // @ts-ignore
  return (
    <MaterialTable
      key={readRowNum}
      columns={columns}
      data={toBeApproved}
      options={options}
      actions={[approve_actions, reject_actions]}
    />
  );
};

// any type fine since props unused
const RequestManagement = (props: any) => (
  <div className="RequestManagementPage">
    <Header />
    <RequestManagementTable {...props} />
  </div>
);

export default RequestManagement;
