import AuditLogController from '../../controllers/AuditLog';
import AuditLogStore from '../AuditLogStore/store';

import { getRequestFactory, createRequestFactory } from './common/REST';

//@ts-ignore not all functions defined
export const getAuditLogRequest = getRequestFactory(AuditLogStore, AuditLogController);
//@ts-ignore not all functions defined
export const createAuditLogRequest = createRequestFactory(AuditLogStore, AuditLogController);
