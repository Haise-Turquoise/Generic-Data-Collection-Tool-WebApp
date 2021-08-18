import axios from 'axios';
import { host } from '../constants/domain';

const TransferStatusController = (() => {
  const transferStatusAxios = axios.create({
    baseURL: `${host}/transferManager`,
    withCredentials: true,
  });

  return {
    setTransfer: async (time: string) => transferStatusAxios.post('/startService', { time }),
    stopTransfer: async () => transferStatusAxios.get('/stopService'),
    fetchStatus: async () => transferStatusAxios.get('/getServiceStatus').then(res=>res.data),
  };
})();

export default TransferStatusController;
