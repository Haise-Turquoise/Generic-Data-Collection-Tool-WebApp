import AuditLogController from '../../controllers/AuditLog';
import AuditLogStore from '../AuditLogStore/store';

import {
  getRequestFactory,
  createRequestFactory
} from './common/REST';

export const getAuditLogRequest = getRequestFactory(AuditLogStore, AuditLogController);
export const createAuditLogRequest = createRequestFactory(AuditLogStore, AuditLogController);
