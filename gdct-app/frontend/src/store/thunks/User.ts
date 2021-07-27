import AuthController from '../../controllers/Auth';
import UserStore from '../UserStore/store';
import UserController from '../../controllers/user';
import { customRequestFactory } from './common/REST';
//@ts-ignore why call this when auth doesn't have .fetch?
export const isSignInRequest = customRequestFactory(UserStore, AuthController);

export const fetchUserByUsername = (username: string) => {
  UserController.fetchUserByUserName(username).then(user => user);
};
