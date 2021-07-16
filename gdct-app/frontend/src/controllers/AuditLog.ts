import axios from 'axios';
import AuditLog from '../types/auditlog';
import { host } from '../constants/domain';

const AuditLogController = (() => {
  const AuditLogAxios = axios.create({
    // The real baseURL used in backend is defined in backend/src/controller/index.js
    baseURL: `${host}/AuditLog`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<AuditLog[]> => AuditLogAxios.get('/fetchAllAuditLogs').then(res => res.data),
    create: async (AuditLogInfo: AuditLog): Promise<AuditLog> =>
      AuditLogAxios.post('/createAuditLog', { AuditLogInfo }).then(res => res.data),
  };
})();

export default AuditLogController;
