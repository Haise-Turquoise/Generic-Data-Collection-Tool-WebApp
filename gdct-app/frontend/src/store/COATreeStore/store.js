import cloneDeep from 'clone-deep';

import { removeNode, changeNodeAtPath } from 'react-sortable-tree';
import { createSlice } from '@reduxjs/toolkit';

const generateTitle = ({ categoryGroupId }) =>
  `${categoryGroupId ? `${categoryGroupId.name}` : ''}`;

const getNodeKey = ({ treeIndex }) => treeIndex;

const UPDATE_ORIGINAL_COA_TREE_UI = state => ({
  ...state,
  originalTree: cloneDeep(state.localTree),
});

const LOAD_COA_TREE_UI = (state, { payload }) => {
  const dependencyMap = {};

  // Hash table of the tree
  const normalizedTreeMap = {};

  const parentNodes = [];

  payload.treeList.forEach(node => {
    const { _id, parentId } = node;

    if (!dependencyMap[parentId]) dependencyMap[parentId] = [];

    if (parentId) {
      dependencyMap[parentId].push(_id);
    } else {
      parentNodes.push(node);
    }
    normalizedTreeMap[_id] = node;
  });

  const originalTree = parentNodes.map(parentNode =>
    createTreeBranch(parentNode._id, normalizedTreeMap, dependencyMap),
  );

  const localTree = cloneDeep(originalTree);

  return {
    ...state,
    originalTree,
    localTree,
    saveTimeStamp: null,
    isCallInProgress: false,
  };
};

const createTreeBranch = (rootId, normalizedTreeMap, dependencyMap) => {
  const children = dependencyMap[rootId];
  const content = normalizedTreeMap[rootId];

  return {
    content,
    title: generateTitle(content),
    children: children
      ? children.map(child => createTreeBranch(child, normalizedTreeMap, dependencyMap))
      : undefined,
  };
};

const UPDATE_LOCAL_COA_TREE_UI = (state, { payload }) => ({
  ...state,
  localTree: payload.tree,
});

const REVERT_COA_TREE_UI = () => ({
  ...state,
  localTree: cloneDeep(state.originalTree),
});

const ADD_ROOT_COA_TREE_UI = (state, { payload }) => {
  const newRootNode = {
    content: payload.tree,
    title: generateTitle(payload.tree),
  };

  console.log('pl', payload);

  return {
    ...state,
    localTree: [...state.localTree, newRootNode],
  };
};

const DELETE_COA_TREE_UI = (state, { payload }) => {
  const newLocalTree = removeNode({
    treeData: state.localTree,
    path: payload.path,
    getNodeKey,
  }).treeData;

  return {
    ...state,
    localTree: newLocalTree,
  };
};

const UPDATE_SELECTED_NODE_COA_TREE_UI = (state, { payload }) => ({
  ...state,
  selectedNodeProps: payload.nodeProps,
});

const SELECT_COA_COA_TREE_UI = (state, { payload }) => {
  // TODO: Clean this up
  const newSelectNodeProps = {
    ...state.selectedNodeProps,
    node: {
      ...state.selectedNodeProps.node,
      content: {
        ...state.selectedNodeProps.node.content,
        categoryId: state.selectedNodeProps.node.content.categoryId.includes(payload._id)
          ? state.selectedNodeProps.node.content.categoryId.filter(
              curCOAId => curCOAId !== payload._id,
            )
          : [...state.selectedNodeProps.node.content.categoryId, payload._id],
      },
    },
  };

  const newLocalTree = changeNodeAtPath({
    treeData: state.localTree,
    path: newSelectNodeProps.path,
    getNodeKey,
    newNode: newSelectNodeProps.node,
  });

  return {
    ...state,
    localTree: newLocalTree,
    selectedNodeProps: newSelectNodeProps,
  };
};

const reducers = {
  LOAD_COA_TREE_UI,
  UPDATE_ORIGINAL_COA_TREE_UI,
  UPDATE_LOCAL_COA_TREE_UI,
  REVERT_COA_TREE_UI,
  ADD_ROOT_COA_TREE_UI,
  DELETE_COA_TREE_UI,
  UPDATE_SELECTED_NODE_COA_TREE_UI,
  SELECT_COA_COA_TREE_UI,
};

const initialState = {
  originalTree: {},
  localTree: [],
  error: null,
  isCallInProgress: false,
  saveTimeStamp: null,
  selectedNodeProps: {},
};

export const COATreeStore = createSlice({
  name: 'COA_TREE',
  initialState,
  reducers,
});

export default COATreeStore;
