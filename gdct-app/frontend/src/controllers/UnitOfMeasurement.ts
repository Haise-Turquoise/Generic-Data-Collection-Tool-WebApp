import axios, { AxiosResponse } from 'axios';
import UnitOfMeasurement from '../types/unitofmeasurement';
import { host } from '../constants/domain';

const UnitOfMeasurementController = (() => {
  const UnitOfMeasurementAxios = axios.create({
    // The real baseURL used in backend is defined in backend/src/controller/index.js
    baseURL: `${host}/unitOfMeasurement`,
    withCredentials: true,
  });

  return {
    fetch: async (): Promise<UnitOfMeasurement[]> => UnitOfMeasurementAxios.get('/fetchAllUnits').then(res => res.data),
    create: async (unit: UnitOfMeasurement): Promise<UnitOfMeasurement | null> =>
      UnitOfMeasurementAxios.post('/createUnit', { unit }).then(res => res.data),
    update: async (unit: UnitOfMeasurement): Promise<AxiosResponse<UnitOfMeasurement>> =>
      UnitOfMeasurementAxios.patch('/updateUnit', { unit }),
    fetchByUnit: async (unit: string): Promise<UnitOfMeasurement | null> =>
      UnitOfMeasurementAxios.post(`/fetchByUnit`, { unit }).then(res => res.data),
    delete: async (id: string) => UnitOfMeasurementAxios.post('/delete', { id })
  };
})();

export default UnitOfMeasurementController;
