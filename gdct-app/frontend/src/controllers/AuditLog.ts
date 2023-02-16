import axios from 'axios';
import AuditLog from '../types/auditlog';
import PurgeLog from '../types/purgelog';
import { host } from '../constants/domain';

const AuditLogController = (() => {
  const AuditLogAxios = axios.create({
    // The real baseURL used in backend is defined in backend/src/controller/index.js
    baseURL: `${host}/AuditLog`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<AuditLog[]> => AuditLogAxios.get('/fetchAllAuditLogs').then(res => res.data),
    create: async (AuditLogInfo: AuditLog): Promise<AuditLog | null> =>
      AuditLogAxios.post('/createAuditLog', { AuditLogInfo }).then(res => res.data),
    move: async (date: Date, user: String): Promise<AuditLog> =>
      AuditLogAxios.put('/moveAuditLog', { date , user }).then(res => res.data),
    fetchLatest: async (): Promise<PurgeLog> => AuditLogAxios.get('/fetchLatest').then(res => res.data),
    fetchArchive: async (startDate: Date, endDate: Date): Promise<AuditLog[]> => AuditLogAxios.post('/fetchFromArchiveLogs', {startDate, endDate}).then(res => res.data),
    fetchPurge: async (): Promise<PurgeLog[]> => AuditLogAxios.get('/fetchAllPurgeLogs').then(res => res.data),
    
  };
})();
//, {params: {startDate: startDate, endDate: endDate}}
export default AuditLogController;
