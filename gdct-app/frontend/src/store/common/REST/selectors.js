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
  createSelector([selectFactoryRESTResponse(storeSelector)], response => {
    return cloneDeep(response.Values);
  }),
);

export const selectFactoryValueById = storeSelector => _id => state =>
  selectFactoryRESTResponseValues(storeSelector)(state).find(({ _id: valueId }) => _id === valueId);

export const selectFactoryRESTLookup = memoizeFunction((storeSelector, field = 'name') =>
  createSelector([selectFactoryRESTResponse(storeSelector)], response => {
    const values = cloneDeep(response.Values);
    console.log('value', values);

    return values.reduce(function (acc, value) {
      acc[value._id] = `${value[field]}`;
      return acc;
    }, {});
  }),
);
