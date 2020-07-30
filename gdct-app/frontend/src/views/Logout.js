import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthController from '../controllers/Auth';

export default function Logout({ setLoggedIn }) {
  const history = useHistory();

  useEffect(() => {
    AuthController.logout().then(res => {
      if (res.status === 'ok') {
        setLoggedIn(false);
        history.push('/');
      }
    });
  }, []);
  return null;
}
