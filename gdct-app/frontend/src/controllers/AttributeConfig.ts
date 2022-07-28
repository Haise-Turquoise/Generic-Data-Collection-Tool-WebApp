import axios from 'axios';
import AttributeConfig from '../types/attributeconfig';
import { host } from '../constants/domain';

const AttributeConfigController = (() => {
    const AttributeConfigAxios = axios.create({
        baseURL: `${host}/role_manager/AttributeConfigs`,
        withCredentials: true,
    });

    return {
        fetchAttributeConfig: async (_id: string): Promise<AttributeConfig | null> =>
            AttributeConfigAxios.post('/fetchAttributeConfig', { _id }).then(res => res.data.AttributeConfig),
        fetch: async (): Promise<AttributeConfig[]> => AttributeConfigAxios.get('/searchAllAttributeConfigs').then(res => res.data),
        create: async (AttributeConfig: AttributeConfig): Promise<AttributeConfig | null> =>
            AttributeConfigAxios.post('/create', { AttributeConfig }).then(res => res.data.AttributeConfig),
        delete: async (_id: string) => AttributeConfigAxios.post('/delete', { _id }),
        update: async (AttributeConfig: Partial<AttributeConfig>) => AttributeConfigAxios.put('/update', { _id: AttributeConfig._id, AttributeConfig }),
    };
})();

export default AttributeConfigController;
