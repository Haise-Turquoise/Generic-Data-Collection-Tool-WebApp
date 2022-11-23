import { createSlice } from '@reduxjs/toolkit';
import { UserNewPasswordStore as UserpasStoreType } from '../types';

// registrationData: user's input in step1(except sysRole) and step2 (sysRole)
// Other part is for ui state
const initialState: UserpasStoreType = {
  passwordData: {
    email: '',
    password: '',
    passwordConfirm: ''
  }
};

const setpasswordData = (state: UserpasStoreType, { payload }: { payload: UserpasStoreType["passwordData"]}) => ({
  ...state,
  passwordData: payload,
});

// reducers to set each state
const reducers = {
  setpasswordData
};

export const UserNewPasswordStore = createSlice({
  name: 'UserNewPassword',
  initialState,
  reducers,
});

export default UserNewPasswordStore;
