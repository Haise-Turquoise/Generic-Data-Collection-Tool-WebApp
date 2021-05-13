import AuthController from '../../controllers/Auth';
import UserStore from '../UserStore/store';
import UserController from '../../controllers/user';
import { customRequestFactory } from './common/REST';

export const isSignInRequest = customRequestFactory(UserStore, AuthController);

export const fetchUserByUsername = username => {
  UserController.fetchUserByUserName(username).then(user => user);
};
