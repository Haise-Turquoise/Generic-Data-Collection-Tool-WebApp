import axios from 'axios';

import { host } from '../constants/domain';

const AuditLogController = (() => {
  const AuditLogAxios = axios.create({
    // The real baseURL used in backend is defined in backend/src/controller/index.js
    baseURL: `${host}/AuditLog`,
    withCredentials: true,
  });

  return {
    fetch: async () => AuditLogAxios.get('/fetchAllAuditLogs').then(res => res.data),
    create: async AuditLogInfo => AuditLogAxios.post(`/createAuditLog`, { AuditLogInfo }).then(res => res.data.AuditLogInfo),
  };
})();

export default AuditLogController;
