import templatePackageController from '../../controllers/templatePackage';
import TemplatePackagesStore from '../TemplatePackagesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getTemplatePackagesRequest = getRequestFactory(
  TemplatePackagesStore,
  templatePackageController,
);
export const createTemplatePackageRequest = createRequestFactory(
  TemplatePackagesStore,
  templatePackageController,
);
export const deleteTemplatePackageRequest = deleteRequestFactory(
  TemplatePackagesStore,
  templatePackageController,
);
export const updateTemplatePackageRequest = updateRequestFactory(
  TemplatePackagesStore,
  templatePackageController,
);
