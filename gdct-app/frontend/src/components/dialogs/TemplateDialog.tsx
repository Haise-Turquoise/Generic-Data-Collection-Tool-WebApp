import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
//@ts-ignore
import StatusController from '../../controllers/status';
//@ts-ignore
import workflowController from '../../controllers/workflow';
//@ts-ignore
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getTemplatesRequest } from '../../store/thunks/template';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectTemplatesStore } from '../../store/TemplatesStore/selectors';
//@ts-ignore
import { selectIsTemplateDialogOpen } from '../../store/DialogsStore/selectors';
import Template from '../../types/template';
import Status from '../../types/status';
import WorkflowProcess from '../../types/workflowprocess';
import { state } from '../../store/types';

const TemplateDialog = ({ selectedTemplates, shouldClose, handleChange }:
  {selectedTemplates:{[key: string]: boolean}, shouldClose:boolean, handleChange:(data:Template)=>void}
  ) => {
  const dispatch = useDispatch();
  const [readTemplates, setTemplates] = useState([]);

  const { isTemplateDialogOpen, templates } = useSelector(
    (state: state) => ({
      isTemplateDialogOpen: selectIsTemplateDialogOpen(state),
      templates: selectFactoryRESTResponseTableValues(selectTemplatesStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_TEMPLATE_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    (data: any) => {
      handleChange(data);
      if (shouldClose) handleClose();
    },
    [dispatch, handleChange, handleClose, shouldClose],
  );

  useEffect(() => {
    if (isTemplateDialogOpen && !templates.length) dispatch(getTemplatesRequest());
  }, [dispatch, isTemplateDialogOpen]);

  useEffect(() => {
    if (templates.length > 0) {
      const workflowProcessArray = templates.map((e:Template) => e.workflowProcessId);

      StatusController.fetch().then((data:Status[]) => {
        //@ts-ignore
        data = data.filter(e => e.name == 'Approved')[0];
        workflowController.fetchProcessesByIds(workflowProcessArray).then((workflowPrcesses:WorkflowProcess[]) => {
          const endedProcesses = workflowPrcesses.filter(e => e.to.length === 0);
          const endedIdArray = endedProcesses.map(e => String(e._id));

          setTemplates(
            templates.filter((template:Template) => endedIdArray.includes(String(template.workflowProcessId))).sort((a: any, b: any)=>
            b.name.localeCompare(a.name)
          ).reverse(),
          );
        });
      });
    }
  }, [templates]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  const getKey:any = selectedTemplates ? (t:Template) => t._id : undefined;

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
