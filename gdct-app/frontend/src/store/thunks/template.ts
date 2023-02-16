//@ts-ignore
import cloneDeep from 'clone-deep';
//@ts-ignore
// import { setExcelData } from '../actions/ui/excel/commands';

import templateController from '../../controllers/template';
import TemplatesStore from '../TemplatesStore/store';

import { getRequestFactory, deleteRequestFactory, updateRequestFactory } from './common/REST';
import { selectFactoryValueById } from '../common/REST/selectors';
import { selectTemplatesStore } from '../TemplatesStore/selectors';
import { unauthorized_dialog } from '../../components/Unauthorized_Dialog/Unauthorized_Dialog';
import Template from '../../types/template';
import { Dispatch } from 'redux';
import { state } from '../types';

export const getTemplatesRequest = getRequestFactory(TemplatesStore, templateController);
export const deleteTemplateRequest = deleteRequestFactory(TemplatesStore, templateController);
export const updateTemplateRequest = updateRequestFactory(TemplatesStore, templateController);

export const createTemplateRequest = (template: Template, resolve: (value?: any) => void, reject: () => void) => (dispatch: Dispatch) => {
  dispatch(TemplatesStore.actions.REQUEST(''));
  templateController
    .create({
      ...template,
      // templateData: createBlankReactState(),
      //@ts-ignore
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
export const getTemplateRequest = (_id: string) => (dispatch: Dispatch) => {
  dispatch(TemplatesStore.actions.REQUEST(''));

  templateController
    .fetchTemplate(_id)
    .then(template => {
      //@ts-ignore special return type
      if (template === 'UNAUTHORIZED ACCESS') {
        unauthorized_dialog();
        dispatch(TemplatesStore.actions.FAIL_REQUEST('unauthorized'));
      }
      // dispatch(setExcelData(convertStateToReactState(template.templateData)));
      // dispatch(setExcelData(template?.templateData));
      dispatch(TemplatesStore.actions.RECEIVE([template]));
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
    });
};

export const updateTemplateWorkflowProcess = (_id: string, workflowProcessId: string) => (dispatch: Dispatch, getState: () => state) => {
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
