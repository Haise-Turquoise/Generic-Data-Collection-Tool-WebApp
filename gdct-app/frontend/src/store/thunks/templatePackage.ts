import { Dispatch } from 'redux';
import { unauthorized_dialog } from '../../components/Unauthorized_Dialog/Unauthorized_Dialog';
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
  //@ts-ignore
  templatePackageController,
);
export const createTemplatePackageRequest = createRequestFactory(
  TemplatePackagesStore,
  //@ts-ignore
  templatePackageController,
);
export const deleteTemplatePackageRequest = deleteRequestFactory(
  TemplatePackagesStore,
  //@ts-ignore
  templatePackageController,
);
export const updateTemplatePackageRequest = updateRequestFactory(
  TemplatePackagesStore,
  //@ts-ignore
  templatePackageController,
);

export const getTemplatePackagePopulatedRequest = (_id: string) => (dispatch: Dispatch) => {
  dispatch(TemplatePackagesStoreActions.REQUEST(''));

  templatePackageController
    .fetchPopulated(_id)
    .then(templatePackage => {
      if (templatePackage === 'UNAUTHORIZED ACCESS') {
        unauthorized_dialog();
        dispatch(TemplatePackagesStoreActions.FAIL_REQUEST(''));
      } else dispatch(TemplatePackagesStoreActions.RECEIVE([templatePackage]));
    })
    .catch(error => {
      dispatch(TemplatePackagesStoreActions.FAIL_REQUEST(error));
    });
};
