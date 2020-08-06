import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { getCOAGroupsRequest } from '../../../store/thunks/COAGroup';

import { createCOATreeRequest } from '../../../store/thunks/COATree';

import SelectableTableDialog from '../../../components/dialogs/SelectableTableDialog';
import DialogsStore from '../../../store/DialogsStore/store';

const COAGroupDialog = ({ sheetNameId }) => {
  const dispatch = useDispatch();

  const { isCOAGroupDialogOpen, COAGroups } = useSelector(
    ({
      COAGroupsStore: {
        response: { Values },
      },
      DialogsStore: { isCOAGroupDialogOpen },
    }) => ({
      isCOAGroupDialogOpen,
      COAGroups: Values,
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => {
    dispatch(DialogsStore.actions.CLOSE_COA_GROUP_DIALOG());
  }, [dispatch]);

  const handleSelect = useCallback(
    COAGroup => {
      dispatch(createCOATreeRequest(COAGroup, sheetNameId, true));
    },
    [dispatch],
  );

  useEffect(() => {
    if (isCOAGroupDialogOpen) dispatch(getCOAGroupsRequest());
  }, [dispatch, isCOAGroupDialogOpen]);

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
    ],
    [],
  );

  return (
    <SelectableTableDialog
      title="COA Groups"
      columns={columns}
      isOpen={isCOAGroupDialogOpen}
      data={COAGroups}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default COAGroupDialog;
