import DataResumeController from '../../controllers/DataResume';
import DataResumeStore from '../DataResumeStore/store';


export const getDataResume = () => dispatch => {
    dispatch(DataResumeStore.actions.REQUEST());
    
    DataResumeController.fetch().then(dataResume => {
        // console.log(dataResume);
        dispatch(DataResumeStore.actions.RECEIVE(dataResume));
    });
  };

  export const updateDataResume = (dataResume, resolve, reject) => (dispatch, getState) => {
    dispatch(DataResumeStore.actions.REQUEST());
    dispatch(DataResumeStore.actions.UPDATE(dataResume));
  
    DataResumeController.update(dataResume)
      .then(result => {
        if (resolve) {
          resolve();
        }
      });
  };