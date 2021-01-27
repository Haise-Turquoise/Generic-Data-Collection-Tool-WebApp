//Oct 16, 2020
//This file exports a page that users can go in to edit templatate spreadsheet files. 
//Since the application is moving onto using google sheets by opening a new tab, this file is currently not being used.

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
import { selectFactoryValueById } from '../../../store/common/REST/selectors';
import workflowController from '../../../controllers/workflow';
import TemplatesStore from '../../../store/TemplatesStore/store';

//import Ssheet from "./SpreadSheet.js";
// import Iframe from 'react-iframe'

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

  const { template } = useSelector(
    state => ({
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

    return () => {
      dispatch(TemplatesStore.actions.RESET());
    };
  }, [_id]);

  return template && template.templateData ? (
    <div>
      <TemplatePhases template={template} />
      {/* <Iframe url="https://docs.google.com/spreadsheets/d/1ej_7DQP6EfZ4UcQM2V5tptaTQkDm_jHWKv3yLDyjRAM/edit#gid=0"
        height="580px"
        title="Google Sheet"
        className="w-100 d-flex justify-content-end"
        position="relative"
        /> */}
    </div>
  ) : (
    <Loading />
  );
};
export default Template;