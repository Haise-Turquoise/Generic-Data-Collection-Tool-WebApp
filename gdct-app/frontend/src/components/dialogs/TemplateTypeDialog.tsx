import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getTemplateTypesRequest } from '../../store/thunks/templateType';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
//@ts-ignore
import { selectIsTemplateTypeDialogOpen } from '../../store/DialogsStore/selectors';
import { state } from '../../store/types';

const TemplateTypeDialog = ({ handleChange }:{handleChange:(id:string)=>void}) => {
  const dispatch = useDispatch();

  const { isTemplateTypeDialogOpen, templateTypes } = useSelector(
    (state: state) => ({
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
    //@ts-ignore
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
