import { deleteAxiosToken, setAxiosToken } from './rest';
import { deleteToken, saveToken } from './storage';

import { setOnline, setOffline } from '../store/actions/app/isOnline';
import { updateAccount, resetAccount } from '../store/actions/domain/account';
import { showAppNavigation, hideAppNavigation } from '../store/actions/ui/isAppNavigationOpen';

export const loadUserState = (dispatch, { user, token }) => {
  if (token) {
    saveToken(token);
    setAxiosToken(token);
  }

  dispatch(setOnline());
  dispatch(updateAccount(user));
  dispatch(showAppNavigation());
};

export const resetUserState = dispatch => {
  deleteAxiosToken();
  deleteToken();

  dispatch(setOffline());

  dispatch(resetAccount());

  dispatch(hideAppNavigation());
};
