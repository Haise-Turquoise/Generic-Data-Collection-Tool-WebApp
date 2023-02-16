import sheetNameController from '../../controllers/sheetName';
import SheetNamesStore from '../SheetNamesStore/store';
import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getSheetNamesRequest = getRequestFactory(SheetNamesStore, sheetNameController);
export const createSheetNameRequest = createRequestFactory(SheetNamesStore, sheetNameController);
export const deleteSheetNameRequest = deleteRequestFactory(SheetNamesStore, sheetNameController);
export const updateSheetNameRequest = updateRequestFactory(SheetNamesStore, sheetNameController);
