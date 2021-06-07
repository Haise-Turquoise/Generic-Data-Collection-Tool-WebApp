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
      const workflowProcessArray = templates.map(e=>e.workflowProcessId);

      StatusController.fetch().then(data=>{
        data=data.filter(e=>e.name == 'Approved')[0];
        workflowController.fetchProcessesByIds(workflowProcessArray).then(workflowPrcesses=>{
          
          const endedProcesses = workflowPrcesses.filter(e=>e.to.length === 0);
          const endedIdArray = endedProcesses.map(e=>String(e._id));

          setTemplates(templates.filter(template=>endedIdArray.includes(String(template.workflowProcessId))));
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
