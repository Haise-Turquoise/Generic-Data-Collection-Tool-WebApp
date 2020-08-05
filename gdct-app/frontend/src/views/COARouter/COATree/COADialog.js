import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { getCOAsRequest } from '../../../store/thunks/COA';

import {
  selectSelectedCOAIdsMap,
  selectSelectedCOATreeId,
} from '../../../store/COATreeStore/selectors';

import SelectableTableDialog from '../../../components/dialogs/SelectableTableDialog';
import COATreeStore from '../../../store/COATreeStore/store';
import DialogsStore from '../../../store/DialogsStore/store';
import { selectFactoryRESTResponseValues } from '../../../store/common/REST/selectors';
import { selectCOAsStore } from '../../../store/COAsStore/selectors';
import { selectIsCOADialogOpen } from '../../../store/DialogsStore/selectors';

const COADialog = () => {
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

  const getKey = useCallback(item => item._id, []);

  const handleSelect = useCallback(
    item => {
      dispatch(COATreeStore.actions.SELECT_COA_COA_TREE_UI({ _id: item._id }));
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
