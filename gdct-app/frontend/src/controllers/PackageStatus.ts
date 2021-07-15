import axios from 'axios';
//@ts-ignore
import { host } from '../constants/domain';

const PackageStatusController = (() => {
  const MenuAxios = axios.create({
    baseURL: `${host}/report/packageStatus`,
    withCredentials: true,
  });
  return {
    fetch: async () => MenuAxios.get('').then(res => res.data),
  };
})();

export default PackageStatusController;
