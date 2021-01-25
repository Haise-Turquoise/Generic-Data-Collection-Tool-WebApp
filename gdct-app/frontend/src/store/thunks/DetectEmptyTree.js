import cloneDeep from 'clone-deep';
import sheetNameController from '../../controllers/sheetName';
import DetectEmptyTreeStore from '../DetectEmptyTreeStore/store';
import COATreeController from '../../controllers/COATree';

export const getDetectEmptyTree = () => dispatch => {
  dispatch(DetectEmptyTreeStore.actions.REQUEST());
  const promiseQuery = [];
  sheetNameController.fetch().then(sheetNames => {
    sheetNames.forEach(sheetName => {
      promiseQuery.push(
        COATreeController.fetchBySheetName(sheetName._id).then(treeContent => {
          return { _id: sheetName._id, name: sheetName.name, value: treeContent };
        }),
      );
    });
    Promise.all(promiseQuery).then(treeContent => {
      dispatch(DetectEmptyTreeStore.actions.RECEIVE(treeContent));
    });
  });
};

export const deleteCOATreeBySheetName = (sheetName, resolve, reject) => (dispatch, getState) => {
  dispatch(DetectEmptyTreeStore.actions.REQUEST());
  const {
    DetectEmptyTreeStore: { response },
  } = getState();
  const newResponse = cloneDeep(response);
  // console.log(newResponse);
  for (const ele of newResponse.Values) {
    if (ele._id == sheetName._id) {
      ele.value = [];
    }
  }
  dispatch(DetectEmptyTreeStore.actions.UPDATE(newResponse.Values));

  COATreeController.fetchBySheetName(sheetName._id)
    .then(treeElementList => {
      treeElementList.forEach(treeElement => {
        COATreeController.delete(treeElement._id);
      });
    })
    .then(result => {
      if (resolve) {
        resolve();
      }
    });
};
