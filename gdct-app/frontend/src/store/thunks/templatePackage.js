import templatePackageController from '../../controllers/templatePackage';
import {
  TemplatePackagesStore,
  TemplatePackagesStoreActions,
} from '../TemplatePackagesStore/store';

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

export const getTemplatePackagePopulatedRequest = _id => dispatch => {
  dispatch(TemplatePackagesStoreActions.REQUEST());

  templatePackageController
    .fetchPopulated(_id)
    .then(templatePackage => {
      dispatch(TemplatePackagesStoreActions.RECEIVE([templatePackage]));
    })
    .catch(error => {
      dispatch(TemplatePackagesStoreActions.FAIL_REQUEST(error));
    });
};
