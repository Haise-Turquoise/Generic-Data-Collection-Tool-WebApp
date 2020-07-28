import { createSelector } from 'reselect';
import cloneDeep from 'clone-deep';
import { memoizeFunction } from '../../../tools/misc';

export const selectFactoryRESTError = memoizeFunction(storeSelector =>
  createSelector([storeSelector], restStore => restStore.error),
);

export const selectFactoryRESTIsCallInProgress = memoizeFunction(storeSelector =>
  createSelector([storeSelector], restStore => restStore.isCallInProgress),
);

export const selectFactoryRESTResponse = memoizeFunction(storeSelector =>
  createSelector([storeSelector], restStore => restStore.response),
);

export const selectFactoryRESTResponseValues = memoizeFunction(storeSelector =>
  createSelector([selectFactoryRESTResponse(storeSelector)], response => response.Values),
);

export const selectFactoryRESTResponseTableValues = memoizeFunction(storeSelector =>
  createSelector([selectFactoryRESTResponse(storeSelector)], response =>
    cloneDeep(response.Values),
  ),
);
