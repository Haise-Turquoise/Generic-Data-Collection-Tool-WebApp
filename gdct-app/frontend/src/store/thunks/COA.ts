import COAController from '../../controllers/COA';
import COAsStore from '../COAsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getCOAsRequest = getRequestFactory(COAsStore, COAController);
export const createCOARequest = createRequestFactory(COAsStore, COAController);
export const deleteCOARequest = deleteRequestFactory(COAsStore, COAController);
export const updateCOARequest = updateRequestFactory(COAsStore, COAController);
