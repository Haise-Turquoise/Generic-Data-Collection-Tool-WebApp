import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import StatusController from '../../controllers/status';
import workflowController from '../../controllers/workflow';
import SelectableTableDialog from './SelectableTableDialog';

import { getTemplatesRequest } from '../../store/thunks/template';
import DialogsStore from '../../store/DialogsStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTemplatesStore } from '../../store/TemplatesStore/selectors';
import { selectIsTemplateDialogOpen } from '../../store/DialogsStore/selectors';

const TemplateDialog = ({ selectedTemplates, shouldClose, handleChange }) => {
  const dispatch = useDispatch();
  const [readTemplates, setTemplates] = useState([]);

  const { isTemplateDialogOpen, templates} = useSelector(
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
      handleChange(data);
      if (shouldClose) handleClose();
    },
    [dispatch, handleChange, handleClose, shouldClose],
  );

  useEffect(() => {
    if (isTemplateDialogOpen && !templates.length) dispatch(getTemplatesRequest());
  }, [dispatch, isTemplateDialogOpen]);

  useEffect(()=>{
    if (templates.length > 0){
      StatusController.fetch().then(data=>{
        data=data.filter(e=>e.name == 'Approved')[0];
        workflowController.fetchByStatusId(data._id).then(item=>{
          const itemIds=item.map(e=>String(e._id));
          setTemplates(templates.filter(template=>itemIds.includes(String(template.workflowProcessId))));
        })
      })
    }
  },[templates])

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  const getKey = selectedTemplates ? t => t._id : undefined;

  return (
    <SelectableTableDialog
      title="Template"
      columns={columns}
      isOpen={isTemplateDialogOpen}
      data={readTemplates}
      handleClose={handleClose}
      handleSelect={handleSelect}
      selectedKeys={selectedTemplates}
      getKey={getKey}
    />
  );
};

export default TemplateDialog;
