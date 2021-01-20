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
      console.log(treeContent);
      dispatch(DetectEmptyTreeStore.actions.RECEIVE(treeContent));
    });
  });
};

export const deleteCOATreeBySheetName = (sheetName, resolve, reject) => (dispatch, getState) => {
  dispatch(DetectEmptyTreeStore.actions.REQUEST());
  console.log(sheetName);
  const {
    DetectEmptyTreeStore: { response },
  } = getState();
  const newResponse = cloneDeep(response);
  console.log(newResponse);
  for (const ele of newResponse.Values) {
    console.log('reach here');
    if (ele._id == sheetName._id) {
      console.log('find the delete one');
      ele.value = [];
    }
  }
  console.log(newResponse);
  dispatch(DetectEmptyTreeStore.actions.UPDATE(newResponse.Values));

  COATreeController.fetchBySheetName(sheetName._id)
    .then(treeElementList => {
      treeElementList.forEach(treeElement => {
        COATreeController.delete(treeElement._id);
      });
    })
    .then(result => {
      // newResponse.forEach((ele)=>{
      //     console.log('reach here')
      //     if(ele._id == sheetName._id){
      //         console.log('find the delete one')
      //         ele.values = []
      //     }
      // })
      // console.log(newResponse)
      // dispatch(DetectEmptyTreeStore.actions.RECEIVE(newResponse.Values));
      if (resolve) {
        resolve();
      }
    });
};
