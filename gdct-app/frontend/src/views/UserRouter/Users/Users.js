import React, { useState, useMemo, useEffect, Component } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';

import './Users.scss';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectUsersStore } from '../../../store/UsersStore/selectors';
import {
  getUsersRequest,
  createUsersRequest,
  deleteUsersRequest,
  updateUsersRequest,
} from '../../../store/thunks/users';

const UsersHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Users</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

/*
const TestButton2 = () => {
  const dispatch = useDispatch()
  //const handleClick = () => dispatch(getUsersRequest({params: {'lastName': 'Hu'}}))
  const handleClick = () => dispatch(getUsersRequest({params: {'sysRole.org.orgId': '8'}}))
  return (
    <Paper className="header">
    <button onClick={handleClick}>
      TEST BUTTON TO RETURN OrgID = 8
    </button>
    </Paper>
  )
}
*/
const UsersTable = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');

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

  const { users } = useSelector(state => ({
    users: selectFactoryRESTResponseTableValues(selectUsersStore)(state),
  }));

  const columns = useMemo(
    () => [
      { title: 'UserName', field: 'username' },
      { title: 'FirstName', field: 'firstName' },
      { title: 'LastName', field: 'lastName' },
      { title: 'Email', field: 'email' },
      { title: 'PhoneNumber', field: 'phoneNumber' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  const options = useMemo(
    () => ({ actionsColumnIndex: -1, search: true, showTitle: false, exportButton: true }),
    [],
  );

  const localization = useMemo(
    () => ({
      toolbar: {
        searchPlaceholder: 'Filter returned data',
        searchTooltip: 'Further filter the returned dataset with this filter bar',
      },
    }),
    [],
  );

  const editable = useMemo(
    () => ({
      // onRowAdd: (user) =>
      //   new Promise((resolve, reject) => {
      //     dispatch(createUsersRequest(user, resolve, reject))
      //   }),
      onRowUpdate: user =>
        new Promise((resolve, reject) => {
          dispatch(updateUsersRequest(user, resolve, reject));
        }),
      // onRowDelete: (user) =>
      //   new Promise((resolve, reject) => {
      //     dispatch(deleteUsersRequest(user._id, resolve, reject))
      //   }),
    }),
    [dispatch],
  );

  const actions = useMemo(() => [
    {
      icon: VisibilityIcon,
      tooltip: 'View User Information',
      onClick: (_event, user) => {
        console.log(`/admin/user_management/${user._id}`);
        history.push(`/admin/user_management/${user._id}`);
      },
    },
  ]);

  useEffect(() => {
    dispatch(getUsersRequest());
  }, [dispatch]);

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
        columns={columns}
        data={users}
        editable={editable}
        options={options}
        actions={actions}
        localization={localization}
      />
    </div>
  );
};

const User = props => (
  <div className="User">
    <UsersHeader />
    <UsersTable {...props} />
  </div>
);

export default User;
