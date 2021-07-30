import { Dispatch } from 'redux';
import DataResumeController from '../../controllers/DataResume';
import DataResume from '../../types/dataresume';
import DataResumeStore from '../DataResumeStore/store';
import { state } from '../types';

export const getDataResume = () => (dispatch: Dispatch) => {
  dispatch(DataResumeStore.actions.REQUEST(''));

  DataResumeController.fetch().then(dataResume => {
    // console.log(dataResume);
    dispatch(DataResumeStore.actions.RECEIVE(dataResume));
  });
};

export const updateDataResume = (dataResume: DataResume, resolve = () => {}, reject = () => {}) => 
  (dispatch: Dispatch, getState: () => state) => {
    dispatch(DataResumeStore.actions.REQUEST(''));
    dispatch(DataResumeStore.actions.UPDATE(dataResume));

    DataResumeController.update(dataResume).then(result => {
      if (resolve) {
        resolve();
      }
  });
};
