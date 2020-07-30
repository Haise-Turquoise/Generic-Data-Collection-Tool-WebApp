import programController from '../../controllers/programs';
import ProgramsStore from '../ProgramsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getProgramsRequest = getRequestFactory(ProgramsStore, programController);
export const createProgramsRequest = createRequestFactory(ProgramsStore, programController);
export const deleteProgramsRequest = deleteRequestFactory(ProgramsStore, programController);
export const updateProgramsRequest = updateRequestFactory(ProgramsStore, programController);
