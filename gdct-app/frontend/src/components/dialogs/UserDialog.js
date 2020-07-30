import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getUsersRequest } from '../../store/thunks/user';

import { selectIsUserDialogOpen } from '../../store/DialogsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import DialogsStore from '../../store/DialogsStore/store';

const UserDialog = ({ handleChange }) => {
  const dispatch = useDispatch();

  const { isUserDialogOpen, users } = useSelector(
    state => ({
      isUserDialogOpen: selectIsUserDialogOpen(state),
      users: selectFactoryRESTResponseTableValues(selectUsersStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_USER_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    data => {
      handleChange(data._id);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isUserDialogOpen && !users.length) dispatch(getUsersRequest());
  }, [dispatch, isUserDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Username',
        field: 'username',
      },
    ],
    [],
  );

  return (
    <SelectableTableDialog
      title="User"
      columns={columns}
      isOpen={isUserDialogOpen}
      data={users}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default UserDialog;
