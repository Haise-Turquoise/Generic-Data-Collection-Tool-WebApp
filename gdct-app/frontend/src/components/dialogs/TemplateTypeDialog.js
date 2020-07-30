import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getTemplateTypesRequest } from '../../store/thunks/templateType';

import DialogsStore from '../../store/DialogsStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
import { selectIsTemplateTypeDialogOpen } from '../../store/DialogsStore/selectors';

const TemplateTypeDialog = ({ handleChange }) => {
  const dispatch = useDispatch();

  const { isTemplateTypeDialogOpen, templateTypes } = useSelector(
    state => ({
      isTemplateTypeDialogOpen: selectIsTemplateTypeDialogOpen(state),
      templateTypes: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(
    () => dispatch(DialogsStore.actions.CLOSE_TEMPLATE_TYPE_DIALOG()),
    [dispatch],
  );

  const handleSelect = useCallback(
    data => {
      handleChange(data._id);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isTemplateTypeDialogOpen && !templateTypes.length) dispatch(getTemplateTypesRequest());
  }, [dispatch, isTemplateTypeDialogOpen]);

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
    <SelectableTableDialog
      title="Template Type"
      columns={columns}
      isOpen={isTemplateTypeDialogOpen}
      data={templateTypes}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default TemplateTypeDialog;
