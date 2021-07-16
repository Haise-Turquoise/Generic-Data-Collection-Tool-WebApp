import axios from 'axios';
import CategoryTree from '../types/categorytree';
import { host } from '../constants/domain';
import SheetName from '../types/sheetname';

const COATreeController = (() => {
  const COATreeAxios = axios.create({
    baseURL: `${host}/COA_manager/COATrees`,
    withCredentials: true,
  });

  return {
    // SUSPECT: NOT IN USE
    // fetchCOATree: async _id => COATreeAxios.post('/fetchCOATree', { _id }).then(res => res.data.COATree),
    fetchBySheetName: async (sheetNameId: string): Promise<CategoryTree[]> => 
      COATreeAxios.post(`/sheetName/fetchBySheetName`, { sheetNameId }).then(res => res.data.COATrees),
    fetchBySheetNames: async (sheetNameIds: SheetName[]): Promise<CategoryTree[]> => 
      COATreeAxios.post(`/sheetName/fetchBySheetNames`, { sheetNameIds }).then(res => res.data.COATrees),
    fetch: async (): Promise<CategoryTree[]> => COATreeAxios.get('/fetch').then(res => res.data.COATrees),
    create: async (COATree: CategoryTree | CategoryTree[]): Promise<CategoryTree> =>
      COATreeAxios.post('/create', { COATree }).then(res => res.data.COATree),
    update: async (COATree: Partial<CategoryTree>) => COATreeAxios.put('/update', { COATree }),
    delete: async (_id: string) => COATreeAxios.post('/delete', { _id }),
    updateBySheetName: async (COATrees: CategoryTree[], sheetNameId: string) =>
      COATreeAxios.put(`/sheetName/updateBySheetName`, { sheetNameId, COATrees }),
  };
})();

export default COATreeController;
