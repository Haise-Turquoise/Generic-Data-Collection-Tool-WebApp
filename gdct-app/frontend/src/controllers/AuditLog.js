import axios from 'axios';

import { host } from '../constants/domain';

const AuditLogController = (() => {
  const AuditLogAxios = axios.create({
    baseURL: `${host}/AuditLog`,
    withCredentials: true,
  });

  return {
    create: async AuditLog => AuditLogAxios.post('', { AuditLog }).then(res => res.data.AuditLog),
    fetch: async () => AuditLogAxios.get('/fetchAllAuditLogs').then(res => res.data.auditlogs),
  };
})();

export default AuditLogController;
