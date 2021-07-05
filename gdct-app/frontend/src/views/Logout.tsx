import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
//@ts-ignore
import AuthController from '../controllers/Auth';
//@ts-ignore
import CreateAuditLog from './AuditLog_Global';
//@ts-ignore
import UserStore from '../store/UserStore/store';

export default function Logout({ setLoggedIn }:{setLoggedIn:(flag:boolean)=>void}) {
  const history = useHistory();

  // Get User Email
  const email = localStorage.getItem('currentUser');
  useEffect(() => {
    AuthController.logout(email).then((res:{status:string}) => {
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
