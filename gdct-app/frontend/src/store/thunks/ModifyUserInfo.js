import userController from '../../controllers/user';
import usersController from '../../controllers/Users';

import {
  ModifyUserInfoStore,
  ModifyUserInfoStoreActions,
} from '../ModifyUserInfo/store';

import {
  updateRequestFactory,
} from './common/REST';

export const updateUserInfoRequest = updateRequestFactory(ModifyUserInfoStore, userController);

export const getUserInfoPopulatedRequest = email => dispatch => {
  dispatch(ModifyUserInfoStoreActions.REQUEST());

  usersController
    .fetchByEmail(email)
    .then(UserInfo => {
      dispatch(ModifyUserInfoStoreActions.RECEIVE([UserInfo]));
    })
    .catch(error => {
      dispatch(ModifyUserInfoStoreActions.FAIL_REQUEST(error));
    });
};
