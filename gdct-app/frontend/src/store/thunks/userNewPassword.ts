import hash from 'object-hash';
//@ts-ignore
import cloneDeep from 'clone-deep';
import bcrypt from 'bcryptjs';
import userController from '../../controllers/user';

import { Dispatch } from 'redux';
import { state } from '../types';
import { DispatchWithoutAction } from 'react';
import UserNewPasswordStore from '../UserNewPasswordStore/store';

interface passwordData {
  email: string,
  password: string,
  passwordConfirm: string
}

export const submit = (values: passwordData) => (dispatch: Dispatch, getState: () => state) => {
  dispatch(UserNewPasswordStore.actions.setpasswordData(values));
    const {
      // @ts-ignore
      UserNewPasswordStore: { passwordData },
    } = getState();
    const userData = cloneDeep(passwordData);
    const email = userData.email.toLowerCase();
    const password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(8));
    delete userData.passwordConfirm;

    return userController.updatePasswordByUserEmail(email, password).catch(error => {
        throw new Error(error); 
  });
}
  