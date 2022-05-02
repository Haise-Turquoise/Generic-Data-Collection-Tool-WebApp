// Oct 16, 2020
// This file exports a page that users can go in to edit templatate spreadsheet files.
// Since the application is moving onto using google sheets by opening a new tab, this file is currently not being used.

import React, { useEffect, useCallback, useState } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RouteComponentProps, RouterProps, useHistory } from 'react-router-dom';
import { Button, Chip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Spreadsheet from './spreadSheet';
//@ts-ignore
import Loading from '../../../components/Loading/Loading';

import { getTemplateRequest, updateTemplateWorkflowProcess } from '../../../store/thunks/template';

import './Template.scss';
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import { selectFactoryValueById } from '../../../store/common/REST/selectors';
import workflowController from '../../../controllers/workflow';
import TemplatesStore from '../../../store/TemplatesStore/store';
import Template from '../../../types/template';
import WorkflowProcess from '../../../types/workflowprocess';
import { state } from '../../../store/types';

interface ProcessPopulated extends Omit<WorkflowProcess, 'to'> {
  to: WorkflowProcess[],
}

const TemplatePhases = ({ template }: { template: Template }) => {
  const [workflowProcess, setWorkflowProcess] = useState<ProcessPopulated | undefined>();
  let buttonStatus = true;
  const dispatch = useDispatch();
  const currRole = localStorage.getItem('currentRole');

  if (currRole === 'Template Designer' || currRole === 'Business Admin') {
    buttonStatus = false;
  }

  useEffect(() => {
    if (template)
      workflowController
        .fetchProcess(template.workflowProcessId)
        //@ts-ignore this call should be populated based on what comes later
        .then((workflowProcess: ProcessPopulated[]) => setWorkflowProcess(workflowProcess || undefined));
  }, [template]);

  const handleClickWorkflow = useCallback(
    (processId: any) => {
      dispatch(updateTemplateWorkflowProcess(template._id, processId));
    },
    [template, dispatch],
  );

  return (
    <div>
      <Paper className="header">
        <Typography variant="h5">{template.name}</Typography>
        <div className="mb-3 d-flex justify-content-end">
          <Chip className="rounded" color="primary" label="Phase Actions:" />
          {workflowProcess && workflowProcess.to.length ? (
            workflowProcess.to.map((outwardProcess) => (
              <Button
                disabled={buttonStatus}
                key={outwardProcess._id}
                onClick={() => handleClickWorkflow(outwardProcess._id)}
              >
                {outwardProcess.statusId.name}
              </Button>
            ))
          ) : (
            <Chip className="rounded" color="secondary" label="Finalized" />
          )}
        </div>
      </Paper>
    </div>
  );
};

const Template = ({
  match: {
    params: { _id },
  },
}: RouteComponentProps<{ _id: string }>) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { template } = useSelector(
    (state: state) => ({
      template: selectFactoryValueById(selectTemplatesStore)(_id)(state),
    }),
    shallowEqual,
  );

  const handleSaveTemplate = useCallback(() => {
    // dispatch(updateTemplateExcelRequest());
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getTemplateRequest(_id));

    return () => {
      dispatch(TemplatesStore.actions.RESET(''));
    };
  }, [_id]);

  return template && template.templateData ? (
    <div>
      <TemplatePhases template={template} />
     
      <Spreadsheet templateID={_id} name={template.name} backButton={()=>history.push('/admin/template/design')}/>
    </div>
  ) : (
    <Loading />
  );
};
export default Template;
