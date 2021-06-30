import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import AuthController from '../controllers/Auth';
import CreateAuditLog from './AuditLog_Global';
import UserStore from '../store/UserStore/store';

export default function Logout({ setLoggedIn }) {
  const history = useHistory();

  // Get User Email
  const email = localStorage.getItem('currentUser');
  useEffect(() => {
    AuthController.logout(email).then(res => {
      if (res.status === 'ok') {
        // Audit Logout
        CreateAuditLog(email, 'Logout', 'Logout', null, {}, {});
        // Set Status
        setLoggedIn(false);
        history.push('/');
      }
    });
  }, []);
  const dispatch = useDispatch();
  dispatch(UserStore.actions.LOGOUT(false));
  return null;
}
