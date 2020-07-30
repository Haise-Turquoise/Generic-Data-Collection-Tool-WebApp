import { setExcelData } from '../actions/ui/excel/commands';

import templateController from '../../controllers/template';
import {
  convertStateToReactState,
  extractReactAndWorkbookState,
  createBlankReactState,
} from '../../tools/excel';
import TemplatesStore from '../TemplatesStore/store';

import { getRequestFactory, deleteRequestFactory, updateRequestFactory } from './common/REST';

export const getTemplatesRequest = getRequestFactory(TemplatesStore, templateController);
export const deleteTemplateRequest = deleteRequestFactory(TemplatesStore, templateController);
export const updateTemplateRequest = updateRequestFactory(TemplatesStore, templateController);

export const createTemplateRequest = (template, resolve, reject) => dispatch => {
  dispatch(TemplatesStore.actions.REQUEST());

  templateController
    .create({
      ...template,
      templateData: createBlankReactState(),
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
      dispatch(setExcelData(convertStateToReactState(template.templateData)));
      dispatch(TemplatesStore.actions.RECEIVE([template]));
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
    });
};

export const updateTemplateExcelRequest = () => (dispatch, getState) => {
  // dispatch(requestTemplates())

  const {
    TemplatesStore: {
      response: { Values },
    },
    ui: {
      excel: { present },
    },
  } = getState();

  const [template] = Values;

  const newTemplate = {
    ...template,
    name: present.name,
    templateData: extractReactAndWorkbookState(present, present.inactiveSheets),
  };

  templateController
    .update(newTemplate)
    .then(() => {
      dispatch(TemplatesStore.actions.UPDATE(newTemplate));
    })
    .catch(error => {
      dispatch(TemplatesStore.actions.FAIL_REQUEST(error));
    });
};
