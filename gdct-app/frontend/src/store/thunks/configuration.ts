//@ts-ignore
import configurationController from '../../controllers/configuration';
//@ts-ignore
import ConfigurationStore from '../Configuration/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getConfigurationRequest = getRequestFactory(
  ConfigurationStore,
  configurationController,
);
export const createConfigurationRequest = createRequestFactory(
  ConfigurationStore,
  configurationController,
);
export const deleteConfigurationRequest = deleteRequestFactory(
  ConfigurationStore,
  configurationController,
);
export const updateConfigurationRequest = updateRequestFactory(
  ConfigurationStore,
  configurationController,
);
