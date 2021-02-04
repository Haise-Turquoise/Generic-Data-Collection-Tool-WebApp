import axios from 'axios';

import { host } from '../constants/domain';

const AuditLogController = (() => {
  const AuditLogAxios = axios.create({
    baseURL: `${host}/AuditLog`,
    withCredentials: true,
  });

  return {
    fetch: async () => AuditLogAxios.get('/fetchAllAuditLogs')
      .then(res => { 
        //console.log(res.data); 
        return res.data 
      }),
    //create: async AuditLog => AuditLogAxios.post(`/createAuditLog`, { AuditLog }).then(res => res.data.AuditLog),
  };
})();

export default AuditLogController;
