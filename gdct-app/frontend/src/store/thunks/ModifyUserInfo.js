import hash from 'object-hash';
import cloneDeep from 'clone-deep';
import bcrypt from 'bcrypt-nodejs';
import { fromAddress } from 'xlsx-populate/lib/addressConverter';
import userController from '../../controllers/user';
import usersController from '../../controllers/Users';
import modifyUserInfoStore from '../ModifyUserInfo/store';
import { getUsersRequest } from './users';

import UsersStore from '../UsersStore/store';

// Loading Update Profile Page
export const getUserInfo = () => (dispatch, getState) =>{

  const email = localStorage.getItem('currentUser');
    usersController.fetchByEmail ({email}).then(users => {console.log(users)
      
      const userInfo = {
        title: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        // password: '',
        // passwordConfirm: '',
        ext: '',
        // IsActive: false,
        // startDate: new Date(),
        // endDate: new Date(),
        // sysRole: [],
      }
        userInfo.title = users.title;
        userInfo.username = users.username;
        userInfo.email = users.email;
        userInfo.firstName = users.firstName;
        userInfo.lastName = users.lastName;
        userInfo.phoneNumber = users.phoneNumber;
        // userInfo.password = users.password;
        userInfo.ext = users.ext;
        // userInfo.IsActive = users.IsActive;
        // userInfo.startDate = users.startDate;
        // userInfo.endDate = users.endDate;
        // userInfo.sysRole = users.sysRole;

        dispatch(modifyUserInfoStore.actions.setRegisteredData(userInfo));
        console.log(userInfo)
          // dispatch(modifyUserInfoStore.actions.setActiveStep(0));
    });
}

const sendRegisteredData = registeredData => {
  return userController.create(registeredData).catch(error => console.error(error));
};

export const changeSubmission = () => (dispatch, getState) => {
  const {
    modifyUserInfoStore: { userSubmissions },
  } = getState();
  dispatch(modifyUserInfoStore.actions.setAbleToComplete(true));
  const permissionList = submissionChange(userSubmissions);
  dispatch(modifyUserInfoStore.actions.setUserPermissionList(permissionList));
};

export const referenceChange = event => dispatch => {
  const {
    target: { name, value },
  } = event;
  dispatch(modifyUserInfoStore.actions.setReference(value));
};

export const stepBack = () => dispatch => {
  dispatch(modifyUserInfoStore.actions.setActiveStep(0));
};

// Profile Update Button
export const stepUpdate = values => (dispatch, getState) => {
  dispatch(modifyUserInfoStore.actions.setRegisteredData(values));

  const {
    ModifyUserInfoStore: { RegisteredData },
  } = getState();
  const userData = cloneDeep(RegisteredData);
  console.log(userData)

  // const sendRegisteredData = registerData => {
    return userController.modifyUserInfo(userData).then((res) =>{
      console.log(res)
    }).catch(error => console.error(error));
  // };

    // const {
    //   UsersStore: { response },
    // } = getState();
    // const users = response.Values;
    // console.log(users);
    // console.log(values);
    // let duplicate = false;
    // users.forEach(user => {
    //   if (user.username == values.username) {
    //     console.log('find duplicate');
    //     duplicate = true;
    //   }
    // });
    // if (duplicate) {
    //   alert('The username has already existed');
    // }
    // if (!duplicate) {
    //   dispatch(modifyUserInfoStore.actions.setActiveStep(0));
    // }
    // dispatch(modifyUserInfoStore.actions.setActiveStep(0));
};

export const submit = () => (dispatch, getState) => {
  const {
    ModifyUserInfoStore: { userSubmissions, registeredData, userAppSys },
  } = getState();
  const userData = cloneDeep(RegisteredData);
  userData.phoneNumber = userData.phoneNumber.replace('-', '');
  userData.hashedUsername = hash(userData.username);
  userData.password = bcrypt.hashSync(userData.password, bcrypt.genSaltSync(8), null);
  userData.email = userData.email.toLowerCase();
  delete userData.passwordConfirm;
  userSubmissions.forEach(submission => {
    handleInputSysRole(userData, 'approve', submission, userAppSys);
    handleInputSysRole(userData, 'review', submission, userAppSys);
    handleInputSysRole(userData, 'input', submission, userAppSys);
    handleInputSysRole(userData, 'submit', submission, userAppSys);
    handleInputSysRole(userData, 'view', submission, userAppSys);
    handleInputSysRole(userData, 'viewCognos', submission, userAppSys);
  });
  console.log('ready to send data');
  sendRegisteredData(userData);
};
