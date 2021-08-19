import { batch } from 'react-redux';
//@ts-ignore
import cloneDeep from 'clone-deep';
//@ts-ignore
import SortableTree, { walk, toggleExpandedForAll } from 'react-sortable-tree';
import COATreeController from '../../controllers/COATree';
import COAController from '../../controllers/COA';
import COAsStore from '../COAsStore/store';
import COATreesStore from '../COATreesStore/store';
//@ts-ignore
import COATreeStore from '../COATreeStore/store';
import DialogsStore from '../DialogsStore/store';
import { deleteRequestFactory, updateRequestFactory, getRequestFactory } from './common/REST';
import { unauthorized_dialog } from '../../components/Unauthorized_Dialog/Unauthorized_Dialog';
import CategoryTree from '../../types/categorytree';
import CategoryGroup from '../../types/categorygroup';
import { Dispatch } from 'redux';
import { state } from '../types';
import Category from '../../types/category';

interface cbCategory extends Category {
  title: string;
}

interface DenormalizedTree {
  children?: DenormalizedTree[];
  title: string;
  content: CategoryTree;
}

interface NodeCategory {
  children?: cbCategory[];
  title: string;
  content: CategoryTree;
}

interface NormalizedTree {
  parentId?: string;
  _id?: string;
  categoryId: string[];
  categoryGroupId: string | CategoryGroup;
  sheetNameId: string;
  content: undefined;
  timestamp?: string;
  updatedBy?: string;
}

interface cbTreeNode {
  lowerSiblingCounts: number[];
  path: number[];
  treeIndex: number;
  parentNode: DenormalizedTree;
  node: DenormalizedTree;
}

interface cbCategoryNode {
  lowerSiblingCounts: number[];
  path: number[];
  treeIndex: number;
  parentNode: DenormalizedTree;
  node: NodeCategory;
}

const normalizeTrees = (denormalizedCOATrees: DenormalizedTree[]) => {
  const stack = [...denormalizedCOATrees];

  const normalizedTrees: NormalizedTree[] = denormalizedCOATrees.map(COATree => ({
    ...COATree.content,
    parentId: undefined,
    content: undefined,
  }));

  while (stack.length) {
    const node = stack.pop();

    const { children } = node || { children: [] };

    const parentId = node?.content._id || '';

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

// export const getCOATreeRequest = _id => dispatch => {
//   dispatch(COATreesStore.actions.REQUEST());

//   COATreeController.fetchCOATree(_id)
//     .then(COATree => {
//       dispatch(COATreeStore.actions.LOAD_COA_TREE_UI({ treeList: [COATree] }));
//     })
//     .catch(error => {
//       dispatch(COATreesStore.actions.FAIL_REQUEST(error));
//     });
// };

export const createCOATreeRequest = (
  COAGroup: CategoryGroup,
  sheetNameId: string,
  isTreeComponent = false,
) => (dispatch: Dispatch) => {
  const COATree = {
    sheetNameId,
    categoryGroupId: COAGroup._id || '',
    categoryId: [],
  };

  dispatch(COATreesStore.actions.REQUEST(''));
  COATreeController.create(COATree)
    .then(COATree => {
      batch(() => {
        dispatch(COATreesStore.actions.CREATE(COATree));
        if (isTreeComponent) {
          //@ts-ignore
          dispatch(COATreeStore.actions.ADD_ROOT_COA_TREE_UI({ tree: COATree }));
          dispatch(DialogsStore.actions.CLOSE_COA_GROUP_DIALOG());
        }
      });
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};

export const getCOATreesBySheetNameRequest = (sheetName: string, isTreeComponent = false) => (
  dispatch: Dispatch,
  getState: () => state,
) => {
  dispatch(COATreesStore.actions.REQUEST(''));
  COAController.fetch()
    .then(result => {
      //@ts-ignore special case
      if (result === 'UNAUTHORIZED ACCESS') unauthorized_dialog();
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
            const getNodeKey = ({ treeIndex }: { treeIndex: number }) => treeIndex;
            const newLocalTree = cloneDeep(localTree);
            const COAs = cloneDeep(response.Values) as Category[];
            walk({
              treeData: newLocalTree,
              getNodeKey,
              callback: (node: cbCategoryNode) => {
                if (node.node.content) {
                  // console.log(node.node.content.categoryId)
                  if (node.node.content.categoryId) {
                    node.node.content.categoryId.forEach(categoryId => {
                      COAs.forEach(COA => {
                        if (categoryId == COA.id) {
                          // console.log(categoryId)
                          // for some reason this adds a field 'title'
                          const COACopy = cloneDeep(COA) as cbCategory;
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

export const updateCOATreesBySheetNameRequest = (sheetNameId: string) => (
  dispatch: Dispatch,
  getState: () => state,
) => {
  const {
    COATreeStore: { localTree },
  } = getState();
  // check duplicates
  const found: string[] = []
  for (let item of localTree) {
    if (found.includes(item.content.categoryGroupId._id)) {
      return 'Duplicate category group not allowed'
    }
    found.push(item.content.categoryGroupId._id)
  }
  // let treeCopy = cloneDeep(toggleExpandedForAll({ treeData:localTree, expanded : true }))
  const treeCopy = cloneDeep(localTree);
  const getNodeKey = ({ treeIndex }: { treeIndex: number }) => treeIndex;
  walk({
    treeData: treeCopy,
    getNodeKey,
    callback: (node: cbTreeNode) => {
      if (node.node.children) {
        node.node.children = node.node.children.filter(child => child.content !== undefined);
      }
    },
    ignoreCollapsed: false,
  });

  dispatch(COATreesStore.actions.REQUEST(''));

  const normalizedTrees = normalizeTrees(treeCopy);
  // add timestamp and updatedBy attributes to normalizedTree obj
  normalizedTrees.forEach(normalizedTree => {
    //TODO please test
    normalizedTree.timestamp = new Date().toString();
    normalizedTree.updatedBy = localStorage.getItem('currentUser') || undefined;
  });
  COATreeController.updateBySheetName(normalizedTrees, sheetNameId)
    .then(_COATrees => {
      dispatch(COATreeStore.actions.UPDATE_ORIGINAL_COA_TREE_UI());
    })
    .catch(error => {
      dispatch(COATreesStore.actions.FAIL_REQUEST(error));
    });
};
