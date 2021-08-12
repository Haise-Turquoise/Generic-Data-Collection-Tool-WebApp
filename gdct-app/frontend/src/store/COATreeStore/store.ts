//@ts-ignore
import cloneDeep from 'clone-deep';
//@ts-ignore
import { walk, removeNode, changeNodeAtPath, toggleExpandedForAll } from 'react-sortable-tree';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, shallowEqual } from 'react-redux';
import RootState from './store';

import CategoryTree from '../../types/categorytree';
// const generateTitle = ({ categoryGroupId }) =>
//   `${categoryGroupId ? `${categoryGroupId.name}` : ''}`;
const generateTitle = (content:CategoryTree) => {
  if (content.categoryGroupId) {
    // the node is categoryGroup
    //@ts-ignore
    return content.categoryGroupId.name;
  }
  if (content.categoryId) {
    // the node of category
    //@ts-ignore
    return content.categoryId[0].name;
  }
  return '';
};

const getNodeKey = ({ treeIndex }:{treeIndex:number}) => treeIndex;

const UPDATE_ORIGINAL_COA_TREE_UI = (state:any) => ({
  ...state,
  originalTree: cloneDeep(state.localTree),
});

const LOAD_COA_TREE_UI = (state:any, { payload }:{payload:{treeList:CategoryTree[]}}) => {
  console.log('payload', payload)
  const dependencyMap:{[key:string]:string[]} = {};

  const normalizedTreeMap:{[key:string]:CategoryTree} = {};

  const parentNodes:any[] = [];

  payload.treeList.forEach((node:any) => {
    const { _id, parentId} = node;

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
//@ts-ignore
const createTreeBranch = (rootId:string, normalizedTreeMap:{[key:string]:CategoryTree}, dependencyMap:{[key:string]:string[]}) => {
  const content = normalizedTreeMap[rootId];
  const children = dependencyMap[rootId];
  console.log('children', children)

  return {
    content,
    title: generateTitle(content),
    children: children
      ? children.map((child:string) => createTreeBranch(child, normalizedTreeMap, dependencyMap))
      : undefined,
  };
};

const UPDATE_LOCAL_COA_TREE_UI = (state:any, { payload }:{payload:{tree:CategoryTree|null}}) => {
  return {
    ...state,
    localTree: payload.tree,
  };
};

const REVERT_COA_TREE_UI = (state:any) => ({
  ...state,
  localTree: cloneDeep(state.originalTree),
});

const ADD_ROOT_COA_TREE_UI = (state:any, { payload }:{payload:{tree:CategoryTree}}) => {
  const newRootNode = {
    content: payload!.tree,
    title: generateTitle(payload!.tree),
  };

  // console.log('pl', payload);

  return {
    ...state,
    localTree: [...state.localTree, newRootNode],
  };
};

const DELETE_COA_TREE_UI = (state:any, { payload }:any) => {
  console.log('payload', payload);
  const treeCopy = cloneDeep(state.localTree);
  toggleExpandedForAll({ treeData: treeCopy, expanded: true });
  let isCategory = false;
  if (payload.node.node.id) {
    isCategory = true;
  }
  if (payload.node.parentNode) {
    walk({
      treeData: treeCopy,
      getNodeKey,
      callback: (node:any) => {
        // console.log(node)
        if (!node.node.content) {
        } else if (isCategory && payload.node.parentNode.content._id == node.node.content._id) {
          // console.log('find the target category parent')
          node.node.content.categoryId = node.node.content.categoryId.filter(
            (category:string) => category !== payload.node.node.id,
          );
          // console.log(node.node.content.categoryId)
        }
      },
      ignoreCollapsed: false,
    });
  }
  //@ts-ignore
  const newLocalTree = removeNode({
    treeData: treeCopy,
    path: payload.node.path,
    getNodeKey,
  })?.treeData;
  return {
    ...state,
    localTree: newLocalTree,
  };
};

const UPDATE_SELECTED_NODE_COA_TREE_UI = (state:any, { payload }:any) => {
  return {
    ...state,
    selectedNodeProps: payload.nodeProps,
  };
};

const SELECT_COA_COA_TREE_UI = (state:any, { payload }:any) => {
  console.log('state', state)
  const newSelectNodeProps = {
    ...state.selectedNodeProps,
    node: {
      ...state.selectedNodeProps.node,
      children: state.selectedNodeProps.node.children
        ? [
            ...state.selectedNodeProps.node.children,
            {
              _id: payload.item._id,
              id: payload.item.id,
              name: payload.item.name,
              COA: payload.item.COA,
              title: payload.item.name,
              children: undefined,
            },
          ]
        : [
            {
              _id: payload.item._id,
              id: payload.item.id,
              name: payload.item.name,
              COA: payload.item.COA,
              title: payload.item.name,
              children: undefined,
            },
          ],
      content: {
        ...state.selectedNodeProps.node.content,
        categoryId: state.selectedNodeProps.node.content.categoryId.includes(payload.item.id)
          ? [...state.selectedNodeProps.node.content.categoryId, payload.item.id]
          : [...state.selectedNodeProps.node.content.categoryId, payload.item.id],
      },
    },
  };
  const treeCopy = cloneDeep(state.localTree);

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
    expanded: true,
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
