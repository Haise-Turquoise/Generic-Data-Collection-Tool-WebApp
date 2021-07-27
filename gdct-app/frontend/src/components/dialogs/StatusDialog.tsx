import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getStatusesRequest } from '../../store/thunks/status';
//@ts-ignore
import { selectIsStatusDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';

const StatusDialog = ({ handleChange }:{handleChange:(data:any)=>void}) => {
  const dispatch = useDispatch();

  const { isStatusDialogOpen, statuses } = useSelector(
    state => ({
      isStatusDialogOpen: selectIsStatusDialogOpen(state),
      statuses: selectFactoryRESTResponseTableValues(selectStatusesStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_STATUS_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    data => {
      handleChange(data);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isStatusDialogOpen && !statuses.length) dispatch(getStatusesRequest());
  }, [dispatch, isStatusDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  return (
    //@ts-ignore
    <SelectableTableDialog
      title="Status"
      columns={columns}
      isOpen={isStatusDialogOpen}
      data={statuses}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default StatusDialog;
