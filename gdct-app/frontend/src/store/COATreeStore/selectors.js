import { createSelector } from 'reselect';

const selectCOATreeStore = state => state.COATreeStore;

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

export const selectSelectedCOAIdsMap = createSelector([selectSelectedNodeCOAIds], categoryId => {
  const selectedCOAIds = {};

  categoryId.forEach(COAId => (selectedCOAIds[COAId] = true));

  return selectedCOAIds;
});

export const selectSelectedCOATreeId = createSelector(
  [selectSelectedNodeContent],
  selectedNodeContent => (selectedNodeContent ? selectedNodeContent._id : undefined),
);
