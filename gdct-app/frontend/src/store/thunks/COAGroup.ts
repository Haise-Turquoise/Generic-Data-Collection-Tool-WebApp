import COAGroupController from '../../controllers/COAGroup';
import COAGroupsStore from '../COAGroupsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getCOAGroupsRequest = getRequestFactory(COAGroupsStore, COAGroupController);
export const createCOAGroupRequest = createRequestFactory(COAGroupsStore, COAGroupController);
export const deleteCOAGroupRequest = deleteRequestFactory(COAGroupsStore, COAGroupController);
export const updateCOAGroupRequest = updateRequestFactory(COAGroupsStore, COAGroupController);
