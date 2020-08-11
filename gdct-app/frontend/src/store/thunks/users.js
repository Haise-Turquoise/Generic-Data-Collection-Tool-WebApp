import usersController from '../../controllers/Users';
import UsersStore from '../UsersStore/store';
import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getUsersRequest = getRequestFactory(UsersStore, usersController);
export const createUsersRequest = createRequestFactory(UsersStore, usersController);
export const deleteUsersRequest = deleteRequestFactory(UsersStore, usersController);
export const updateUsersRequest = updateRequestFactory(UsersStore, usersController);
