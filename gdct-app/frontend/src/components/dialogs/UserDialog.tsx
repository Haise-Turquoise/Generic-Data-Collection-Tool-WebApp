import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getUsersRequest } from '../../store/thunks/user';
//@ts-ignore
import { selectIsUserDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectUsersStore } from '../../store/UsersStore/selectors.js';
const UserDialog = ({ handleChange }:{handleChange:(id:string)=>void}) => {
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
    //@ts-ignore
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
