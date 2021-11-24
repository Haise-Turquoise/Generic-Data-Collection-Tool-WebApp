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
//@ts-ignore
const selectSelectedNodeContent = createSelector([selectSelectedNode], selectedNode =>
  selectedNode ? selectedNode.content : undefined,
);

const selectSelectedNodeCOAIds = createSelector([selectSelectedNodeContent], selectedNodeContent =>
  //@ts-ignore
  selectedNodeContent ? selectedNodeContent.categoryId : [],
);

// const selectSelectedupdatedAt = createSelector(
//   [selectCOATreeStore],
//   COATreeStore => COATreeStore.selectedNodeProps,
// );

// export const selectCOATreeupdatedAt = createSelector(
//   [selectCOATreeStore],
//   COATreeStore => COATreeStore.updatedAt,
// );

export const selectSelectedCOAIdsMap = createSelector([selectSelectedNodeCOAIds], categoryId => {
  const selectedCOAIds:{[key:string]:boolean} = {};

  categoryId.forEach((COAId:string) => (selectedCOAIds[COAId] = true));

  return selectedCOAIds;
});

export const selectSelectedCOATreeId = createSelector(
  [selectSelectedNodeContent],
  //@ts-ignore
  selectedNodeContent => (selectedNodeContent ? selectedNodeContent._id : undefined),
);
