import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthController from '../controllers/Auth';
import CreateAuditLog from './AuditLog_Global'

export default function Logout({ setLoggedIn }) {
  const history = useHistory();

  // Get User Email
  var node = document.getElementById('MuiChip-label');
  const email = node.textContent;
  useEffect(() => {
    AuthController.logout(email).then(res => {
      if (res.status === 'ok') {
        // Audit Logout
        CreateAuditLog(email, 'Logout', 'Logout', null, {}, {});
        setLoggedIn(false);
        history.push('/');
      }
    });
  }, []);
  return null;
}
