import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getTemplatesRequest } from '../../store/thunks/template';

import DialogsStore from '../../store/DialogsStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTemplatesStore } from '../../store/TemplatesStore/selectors';
import { selectIsTemplateDialogOpen } from '../../store/DialogsStore/selectors';

const TemplateDialog = ({ handleChange }) => {
  const dispatch = useDispatch();

  const { isTemplateDialogOpen, templates } = useSelector(
    state => ({
      isTemplateDialogOpen: selectIsTemplateDialogOpen(state),
      templates: selectFactoryRESTResponseTableValues(selectTemplatesStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_TEMPLATE_DIALOG()), [
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
    if (isTemplateDialogOpen && !templates.length) dispatch(getTemplatesRequest());
  }, [dispatch, isTemplateDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: '_id',
        field: '_id',
      },
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
      isOpen={isTemplateDialogOpen}
      data={templates}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default TemplateDialog;
