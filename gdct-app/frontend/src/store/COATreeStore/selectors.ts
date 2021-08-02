import { createSelector } from 'reselect';

const selectCOATreeStore = (state:any) => state.COATreeStore;

const selectSelectedNodeProps = createSelector(
  [selectCOATreeStore],
  COATreeStore => COATreeStore.selectedNodeProps,
);

const selectSelectedNode = createSelector(
  [selectSelectedNodeProps],
  selectedNodeProps => selectedNodeProps.node,
);

const selectSelectedNodeContent = createSelector([selectSelectedNode], selectedNode =>
  selectedNode ? selectedNode.content : undefined,
);

const selectSelectedNodeCOAIds = createSelector([selectSelectedNodeContent], selectedNodeContent =>
  selectedNodeContent ? selectedNodeContent.categoryId : [],
);

// const selectSelectedTimestamp = createSelector(
//   [selectCOATreeStore],
//   COATreeStore => COATreeStore.selectedNodeProps,
// );

// export const selectCOATreeTimestamp = createSelector(
//   [selectCOATreeStore],
//   COATreeStore => COATreeStore.timestamp,
// );

export const selectSelectedCOAIdsMap = createSelector([selectSelectedNodeCOAIds], categoryId => {
  const selectedCOAIds:{[key:string]:boolean} = {};

  categoryId.forEach((COAId:string) => (selectedCOAIds[COAId] = true));

  return selectedCOAIds;
});

export const selectSelectedCOATreeId = createSelector(
  [selectSelectedNodeContent],
  selectedNodeContent => (selectedNodeContent ? selectedNodeContent._id : undefined),
);
