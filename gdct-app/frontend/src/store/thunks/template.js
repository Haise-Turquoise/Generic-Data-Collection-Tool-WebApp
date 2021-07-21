import cloneDeep from 'clone-deep';
import { setExcelData } from '../actions/ui/excel/commands';

import templateController from '../../controllers/template';
import TemplatesStore from '../TemplatesStore/store';

import { getRequestFactory, deleteRequestFactory, updateRequestFactory } from './common/REST';
import { selectFactoryValueById } from '../common/REST/selectors';
import { selectTemplatesStore } from '../TemplatesStore/selectors';
import { unauthorized_dialog } from '../../components/Unauthorized_Dialog/Unauthorized_Dialog';

export const getTemplatesRequest = getRequestFactory(TemplatesStore, templateController);
export const deleteTemplateRequest = deleteRequestFactory(TemplatesStore, templateController);
export const updateTemplateRequest = updateRequestFactory(TemplatesStore, templateController);

export const createTemplateRequest = (template, resolve, reject) => dispatch => {
  dispatch(TemplatesStore.actions.REQUEST());
  templateController
    .create({
      ...template,
      // templateData: createBlankReactState(),
      templateData: {},
    })
    .then(template => {
      dispatch(TemplatesStore.actions.CREATE(template));
      resolve();
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
      reject();
    });
};

// ? Cause page redirection on error
export const getTemplateRequest = _id => dispatch => {
  dispatch(TemplatesStore.actions.REQUEST());

  templateController
    .fetchTemplate(_id)
    .then(template => {
      if (template === 'UNAUTHORIZED ACCESS') {
        unauthorized_dialog();
        dispatch(TemplatesStore.actions.FAIL_REQUEST());
      }
      // dispatch(setExcelData(convertStateToReactState(template.templateData)));
      dispatch(setExcelData(template.templateData));
      dispatch(TemplatesStore.actions.RECEIVE([template]));
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
    });
};

export const updateTemplateWorkflowProcess = (_id, workflowProcessId) => (dispatch, getState) => {
  const template = cloneDeep(selectFactoryValueById(selectTemplatesStore)(_id)(getState()));

  template.workflowProcessId = workflowProcessId;

  templateController
    .updateTemplateWorkflowProcess(_id, workflowProcessId)
    .then(() => {
      dispatch(TemplatesStore.actions.UPDATE(template));
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
    });
};
