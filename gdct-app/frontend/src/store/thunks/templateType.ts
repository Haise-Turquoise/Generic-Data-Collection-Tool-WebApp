import templateTypeController from '../../controllers/templateType';
import TemplateTypesStore from '../TemplateTypesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getTemplateTypesRequest = getRequestFactory(
  TemplateTypesStore,
  templateTypeController,
);
export const createTemplateTypeRequest = createRequestFactory(
  TemplateTypesStore,
  templateTypeController,
);
export const deleteTemplateTypeRequest = deleteRequestFactory(
  TemplateTypesStore,
  templateTypeController,
);
export const updateTemplateTypeRequest = updateRequestFactory(
  TemplateTypesStore,
  templateTypeController,
);
