import axios from 'axios';

import { host } from '../constants/domain';

const TransferStatusController = (()=>{
    const transferStatusAxios = axios.create({
        baseURL: `${host}/transfer_manager`,
        withCredentials: true,
    });

    return {
        startTransfer: async time => transferStatusAxios.get(`/startService/${time}`),
        stopTransfer: async ()=> transferStatusAxios.get('/stopService'),
        fetchStatus: async ()=>transferStatusAxios.get('/getServiceStatus'),
    };

})();

export default TransferStatusController; 