import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';

//@ts-ignore
import { getCOAsRequest } from '../../../store/thunks/COA';

import {
  selectSelectedCOAIdsMap,
  selectSelectedCOATreeId,
//@ts-ignore
} from '../../../store/COATreeStore/selectors';

//@ts-ignore
import SelectableTableDialog from '../../../components/dialogs/SelectableTableDialog';
//@ts-ignore
import COATreeStore from '../../../store/COATreeStore/store';
//@ts-ignore
import DialogsStore from '../../../store/DialogsStore/store';
//@ts-ignore
import { selectFactoryRESTResponseValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectCOAsStore } from '../../../store/COAsStore/selectors';
//@ts-ignore
import { selectIsCOADialogOpen } from '../../../store/DialogsStore/selectors';

const COADialog = ({ Auditlog_Operations }: { Auditlog_Operations: string[] }) => {
  const dispatch = useDispatch();

  const { COAs, selectedCOAIds, isCOADialogOpen, COATreeId } = useSelector(
    state => ({
      selectedCOAIds: selectSelectedCOAIdsMap(state),
      COATreeId: selectSelectedCOATreeId(state),
      COAs: selectFactoryRESTResponseValues(selectCOAsStore)(state),
      isCOADialogOpen: selectIsCOADialogOpen(state),
    }),
    shallowEqual,
  );

  const getKey = useCallback(item => item.id, []);
  const handleSelect = useCallback(
    item => {
      dispatch(COATreeStore.actions.SELECT_COA_COA_TREE_UI({ item }));
      Auditlog_Operations.push(`        Added Node: ${item.name}`)
    },
    [dispatch],
  );

  useEffect(() => {
    if (isCOADialogOpen) dispatch(getCOAsRequest());
  }, [dispatch, isCOADialogOpen]);

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_COA_DIALOG()), [
    dispatch,
  ]);

  const columns = useMemo(() => [{ title: 'Name', field: 'name' }], []);

  return (
    <SelectableTableDialog
      title={`COAs - ${COATreeId}`}
      columns={columns}
      selectedKeys={selectedCOAIds}
      getKey={getKey}
      isOpen={isCOADialogOpen}
      data={COAs}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default COADialog;
