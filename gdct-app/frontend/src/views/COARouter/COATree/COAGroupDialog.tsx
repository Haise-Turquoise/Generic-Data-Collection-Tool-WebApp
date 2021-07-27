import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';

//@ts-ignore
import { getCOAGroupsRequest } from '../../../store/thunks/COAGroup';

//@ts-ignore
import { createCOATreeRequest } from '../../../store/thunks/COATree';

//@ts-ignore
import SelectableTableDialog from '../../../components/dialogs/SelectableTableDialog';
//@ts-ignore
import DialogsStore from '../../../store/DialogsStore/store';
import CategoryGroup from '../../../types/categorygroup';
type SelectorParams = {
  COAGroupsStore: {
    response: {
      Values: CategoryGroup[]
    }
  },
  DialogsStore: {
    isCOAGroupDialogOpen: boolean
  }
}
type SelectorResult = {
  isCOAGroupDialogOpen: boolean,
  COAGroups: CategoryGroup[]
}

const COAGroupDialog = ({ sheetNameId, Auditlog_Operations }:
  { sheetNameId: string, Auditlog_Operations: string[] }) => {
  const dispatch = useDispatch();

  const { isCOAGroupDialogOpen, COAGroups } = useSelector<SelectorParams, SelectorResult>(
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
      Auditlog_Operations.push(`Added Group: ${COAGroup.name}`);
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
    //@ts-ignore
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
