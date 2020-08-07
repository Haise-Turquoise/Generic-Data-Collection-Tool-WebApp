import React, { useEffect, useCallback, useState } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button, Chip } from '@material-ui/core';

import Loading from '../../../components/Loading/Loading';

import {
  updateTemplateExcelRequest,
  getTemplateRequest,
  updateTemplateWorkflowProcess,
} from '../../../store/thunks/template';
import { Excel } from '../../../components/Excel';

import './Template.scss';
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import {
  selectFactoryRESTIsCallInProgress,
  selectFactoryValueById,
} from '../../../store/common/REST/selectors';
import workflowController from '../../../controllers/workflow';

const TemplatePhases = ({ template }) => {
  const [workflowProcess, setWorkflowProcess] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (template)
      workflowController
        .fetchProcess(template.workflowProcessId)
        .then(workflowProcess => setWorkflowProcess(workflowProcess));
  }, [template]);

  const handleClickWorkflow = useCallback(
    processId => {
      dispatch(updateTemplateWorkflowProcess(template._id, processId));
    },
    [template, dispatch],
  );

  return (
    <div className="mb-3 d-flex justify-content-end">
      <Chip className="rounded" color="primary" label="Phase Actions:" />
      {workflowProcess && workflowProcess.to.length ? (
        workflowProcess.to.map(outwardProcess => (
          <Button key={outwardProcess._id} onClick={() => handleClickWorkflow(outwardProcess._id)}>
            {outwardProcess.statusId.name}
          </Button>
        ))
      ) : (
        <Chip className="rounded" color="secondary" label="Finalized" />
      )}
    </div>
  );
};

const Template = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();

  const { isCallInProgress, template } = useSelector(
    state => ({
      isCallInProgress: selectFactoryRESTIsCallInProgress(selectTemplatesStore)(state),
      template: selectFactoryValueById(selectTemplatesStore)(_id)(state),
    }),
    shallowEqual,
  );

  const handleSaveTemplate = useCallback(() => {
    dispatch(updateTemplateExcelRequest());
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getTemplateRequest(_id));
  }, []);

  return isCallInProgress ? (
    <Loading />
  ) : (
    <div>
      <TemplatePhases template={template} />
      <Excel
        type="template"
        returnLink="/template_manager/templates"
        handleSave={handleSaveTemplate}
      />
    </div>
  );
};

export default Template;
