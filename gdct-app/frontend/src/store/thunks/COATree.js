import { batch } from 'react-redux';
import cloneDeep from 'clone-deep';
import SortableTree, { walk, toggleExpandedForAll } from 'react-sortable-tree';
import COATreeController from '../../controllers/COATree';
import COAController from '../../controllers/COA';
import COAsStore from '../COAsStore/store';
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

export const getCOATreesBySheetNameRequest = (sheetName, isTreeComponent = false) => (
  dispatch,
  getState,
) => {
  dispatch(COATreesStore.actions.REQUEST());
  COAController.fetch()
    .then(result => {
      dispatch(COAsStore.actions.RECEIVE(result));
    })
    .then(result => {
      COATreeController.fetchBySheetName(sheetName)
        .then(COATrees => {
          batch(() => {
            dispatch(COATreesStore.actions.RECEIVE(COATrees));
            if (isTreeComponent)
              dispatch(COATreeStore.actions.LOAD_COA_TREE_UI({ treeList: COATrees }));
            const {
              COATreeStore: { localTree },
            } = getState();
            // console.log(localTree)
            const {
              COAsStore: { response },
            } = getState();
            // console.log(response)

            const getNodeKey = ({ treeIndex }) => treeIndex;
            const newLocalTree = cloneDeep(localTree);
            const COAs = cloneDeep(response.Values);
            // console.log(COAs)
            walk({
              treeData: newLocalTree,
              getNodeKey,
              callback: node => {
                // console.log(node)
                if (node.node.content) {
                  // console.log(node.node.content.categoryId)
                  if (node.node.content.categoryId) {
                    node.node.content.categoryId.forEach(categoryId => {
                      COAs.forEach(COA => {
                        if (categoryId == COA.id) {
                          // console.log(categoryId)
                          const COACopy = cloneDeep(COA);
                          COACopy.title = COACopy.name;
                          if (!node.node.children) {
                            // console.log('child is empty')
                            node.node.children = [COACopy];
                          } else if (!node.node.children.some(child => child.id === COACopy.id)) {
                            // console.log('not in there')
                            node.node.children.push(COACopy);
                          } else if (node.node.children.some(child => child.id === COACopy.id)) {
                            // console.log('already in there')
                            node.node.children.push(COACopy);
                          }
                        }
                      });
                    });
                  }
                }
              },
              ignoreCollapsed: false,
            });
            // console.log(newLocalTree)

            dispatch(COATreeStore.actions.UPDATE_LOCAL_COA_TREE_UI({ tree: newLocalTree }));
          });
        })
        .catch(error => {
          dispatch(COATreesStore.actions.FAIL_REQUEST(error));
        });
    });
};

export const updateCOATreesBySheetNameRequest = sheetNameId => (dispatch, getState) => {
  const {
    COATreeStore: { localTree },
  } = getState();

  // let treeCopy = cloneDeep(toggleExpandedForAll({ treeData:localTree, expanded : true }))
  const treeCopy = cloneDeep(localTree);
  const getNodeKey = ({ treeIndex }) => treeIndex;
  walk({
    treeData: treeCopy,
    getNodeKey,
    callback: node => {
      // console.log(node)
      if (node.node.children) {
        node.node.children = node.node.children.filter(child => child.content !== undefined);
      }
    },
    ignoreCollapsed: false,
  });

  dispatch(COATreesStore.actions.REQUEST());

  const normalizedTrees = normalizeTrees(treeCopy);
  // console.log(normalizedTrees);
  COATreeController.updateBySheetName(normalizedTrees, sheetNameId)
    .then(_COATrees => {
      dispatch(COATreeStore.actions.UPDATE_ORIGINAL_COA_TREE_UI());
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};
