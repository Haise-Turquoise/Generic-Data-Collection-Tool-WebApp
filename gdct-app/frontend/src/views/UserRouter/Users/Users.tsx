import React, { useState, useMemo, useEffect, Component } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable, { Action, Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import moment from 'moment';

import VisibilityIcon from '@material-ui/icons/Visibility';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectUsersStore } from '../../../store/UsersStore/selectors';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc'
import {
  getUsersRequest,
  updateUsersRequest,
//@ts-ignore
} from '../../../store/thunks/users';

//@ts-ignore
import usersController from '../../../controllers/Users';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';

import User from '../../../types/user';
import SysRole from '../../../types/sysrole';

const UsersHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">User Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const UsersTable = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // For Custom Filter Header
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [readRowNum, setRowNum] = useState(1);
  const [hasUsers, setHasUsers] = useState(false);

  // table vars for loading
  const preColumns: Column<User>[] = [{ title: 'Name', field: 'username' }]
  const preUsers: User[] = [{
    _id: '',
    approvedDate: '',
    creationDate: '',
    email: '',
    firstName: '',
    isActive: true,
    isEmailVerified: true,
    lastName: '',
    password: '',
    phoneNumber: '',
    sysRole: [],
    timestamp: '',
    title: '',
    username: 'LOADING...',
  }]

  const handleClear = () => {
    setUserName('');
    setLastName('');
    setFirstName('');
    setOrgId('');
    setOrgName('');
  };

  const handleClick = () => {
    let l = '';
    let f = '';
    let u = '';
    let o = '';
    let n = '';

    userName !== '' ? (u = userName) : '';
    firstName !== '' ? (f = firstName) : '';
    lastName !== '' ? (l = lastName) : '';
    orgId !== '' ? (o = orgId) : '';
    orgName !== '' ? (n = orgName) : '';

    dispatch(
      getUsersRequest({
        params: {
          username: u,
          lastName: l,
          firstName: f,
          'sysRole.org.orgId': o,
          'sysRole.org.orgName': n,
        },
      }),
    );
  };

  // Prepare the data for material table
  const { users }: { users: User[] } = useSelector(state => ({
    users: selectFactoryRESTResponseTableValues(selectUsersStore)(state),
  }));
  // Convert Date format
  users.forEach(user => {
    const logtime = new Date(user.timestamp);
    user.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  // Prepare the columns for material table
  const columns: Column<User>[] = useMemo(
    () => [
      { title: 'User Name', field: 'username' },
      { title: 'First Name', field: 'firstName' },
      { title: 'Last Name', field: 'lastName' },
      { title: 'Email', field: 'email' },
      { title: 'Phone Number', field: 'phoneNumber' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [],
  );

  const options: Options<User> = useMemo(() => calculateOptions(readRowNum),[readRowNum]);

  // Customization for search bar
  const localization = useMemo(
    () => ({
      toolbar: {
        searchPlaceholder: 'Filter returned data',
        searchTooltip: 'Further filter the returned dataset with this filter bar',
      },
    }),
    [],
  );


  // Record username and time when an action occurs 
  function recordUpdate(user: User) {
    user.updatedBy = localStorage.getItem('currentUser') || '';
    user.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowUpdate: (user: User) =>
        new Promise((resolve, reject) => {
          recordUpdate(user);
          // Find the old value before updating in order to Auditlog
          (async () => {
            // seems redundant, but we cannot put user._id directly into an object
            const { _id } = user;
            const oldUser = await usersController.fetchById({ _id });
            CreateAuditLog(null, 'Update User', 'User', oldUser._id, oldUser, user);
          })();
          // Do Update
          dispatch(updateUsersRequest(user, resolve, reject));
        }),
    }),
    [dispatch],
  );

  // Prepare the actions for material table
  const actions: Action<User>[] = [
    {
      icon: VisibilityIcon,
      tooltip: 'View User Information',
      onClick: (_: any, user: User | User[]) => {
        if (!Array.isArray(user)) {
          history.push(`/admin/user_management/${user._id}`);
        }
      },
    },
  ];

  useEffect(() => {
    dispatch(getUsersRequest());
  }, [dispatch]);

  useEffect(() => {
    setRowNum(users.length);
    if (!hasUsers) {
      setHasUsers(users.length >= 1);
    }
  }, [users]);

  return (
    <div>
      <Paper className="header">
        <div>
          UserName:<span> </span>
          <input type="text" value={userName} onChange={e => setUserName(e.target.value)} />
        </div>
        <div>
          FirstName:<span> </span>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>
        <div>
          LastName:<span> </span>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
        <div>
          OrgId:<span> </span>
          <input type="text" value={orgId} onChange={e => setOrgId(e.target.value)} />
        </div>
        <div>
          OrgName:<span> </span>
          <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} />
        </div>
        <div>
          <button onClick={handleClick}>Search</button>
          <span> </span>
          <button onClick={handleClear}>Clear</button>
        </div>
      </Paper>
      <MaterialTable
        key={readRowNum}
        columns={hasUsers ? columns : preColumns}
        data={hasUsers ? users : preUsers}
        editable={hasUsers ? editable : undefined}
        options={options}
        actions={hasUsers ? actions : undefined}
        localization={localization}
      />
    </div>
  );
};

// any type since props unused
const User = (props: any) => (
  <div className="User">
    <UsersHeader />
    <UsersTable {...props} />
  </div>
);

export default User;
