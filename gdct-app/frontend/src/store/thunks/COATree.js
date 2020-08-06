import { batch } from 'react-redux';

import COATreeController from '../../controllers/COATree';
import COATreesStore from '../COATreesStore/store';
import COATreeStore from '../COATreeStore/store';
import DialogsStore from '../DialogsStore/store';
import { deleteRequestFactory, updateRequestFactory, getRequestFactory } from './common/REST';

const normalizeTrees = denormalizedCOATrees => {
  const stack = [...denormalizedCOATrees];

  const normalizedTrees = denormalizedCOATrees.map(COATree => ({
    ...COATree.content,
    parentId: undefined,
    content: undefined,
  }));

  while (stack.length) {
    const node = stack.pop();

    const { children } = node;

    const parentId = node.content._id;

    if (children) {
      children.forEach(child => {
        const childContent = child.content;

        normalizedTrees.push({ ...childContent, parentId, content: undefined });

        stack.push(child);
      });
    }
  }

  return normalizedTrees;
};

export const getCOATreesRequest = getRequestFactory(COATreesStore, COATreeController);
export const deleteCOATreeRequest = deleteRequestFactory(COATreesStore, COATreeController);
export const updateCOATreeRequest = updateRequestFactory(COATreesStore, COATreeController);

export const getCOATreeRequest = _id => dispatch => {
  dispatch(COATreesStore.actions.REQUEST());

  COATreeController.fetchCOATree(_id)
    .then(COATree => {
      dispatch(COATreeStore.actions.LOAD_COA_TREE_UI({ treeList: [COATree] }));
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};

export const createCOATreeRequest = (
  COAGroup,
  sheetNameId,
  isTreeComponent = false,
) => dispatch => {
  const COATree = {
    sheetNameId,
    categoryGroupId: COAGroup._id,
  };

  dispatch(COATreesStore.actions.REQUEST());

  COATreeController.create(COATree)
    .then(COATree => {
      batch(() => {
        dispatch(COATreesStore.actions.CREATE(COATree));
        if (isTreeComponent) {
          dispatch(COATreeStore.actions.ADD_ROOT_COA_TREE_UI({ tree: COATree }));
          dispatch(DialogsStore.actions.CLOSE_COA_GROUP_DIALOG());
        }
      });
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};

export const getCOATreesBySheetNameRequest = (sheetName, isTreeComponent = false) => dispatch => {
  dispatch(COATreesStore.actions.REQUEST());

  COATreeController.fetchBySheetName(sheetName)
    .then(COATrees => {
      batch(() => {
        dispatch(COATreesStore.actions.RECEIVE(COATrees));
        if (isTreeComponent)
          dispatch(COATreeStore.actions.LOAD_COA_TREE_UI({ treeList: COATrees }));
      });
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};

export const updateCOATreesBySheetNameRequest = sheetNameId => (dispatch, getState) => {
  const {
    COATreeStore: { localTree },
  } = getState();

  dispatch(COATreesStore.actions.REQUEST());

  const normalizedTrees = normalizeTrees(localTree);

  COATreeController.updateBySheetName(normalizedTrees, sheetNameId)
    .then(_COATrees => {
      dispatch(COATreeStore.actions.UPDATE_ORIGINAL_COA_TREE_UI());
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};
