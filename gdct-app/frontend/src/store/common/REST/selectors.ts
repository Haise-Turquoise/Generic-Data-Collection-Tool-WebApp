import { createSelector } from 'reselect';
import cloneDeep from 'clone-deep';
//@ts-ignore
import { memoizeFunction } from '../../../tools/misc';
import { Selector } from 'react-redux';
import { RestStateType, state } from '../../types';
import { Slice, SliceCaseReducers } from '@reduxjs/toolkit';

export const selectFactoryRESTError = memoizeFunction((storeSelector: Selector<state, RestStateType>) =>
  createSelector([storeSelector], restStore => restStore.error),
);

export const selectFactoryRESTIsCallInProgress = memoizeFunction((storeSelector: Selector<state, RestStateType>) =>
  createSelector([storeSelector], restStore => restStore.isCallInProgress),
);

export const selectFactoryRESTResponse = memoizeFunction((storeSelector: Selector<state, RestStateType>) =>
  createSelector([storeSelector], restStore => restStore.response),
);

export const selectFactoryRESTResponseValues = memoizeFunction((storeSelector: Selector<state, RestStateType>) =>
  createSelector([selectFactoryRESTResponse(storeSelector)], (response: RestStateType["response"]) => response.Values),
);

export const selectFactoryRESTResponseTableValues = memoizeFunction((storeSelector: Selector<state, RestStateType>) =>
  createSelector([selectFactoryRESTResponse(storeSelector)], (response: RestStateType["response"]) => {
    return cloneDeep(response.Values);
  }),
);

export const selectFactoryValueById = (storeSelector: Selector<state, RestStateType>) => (_id: string) => (state: state) =>
  selectFactoryRESTResponseValues(storeSelector)(state).find(({ _id: valueId }: { _id: string }) => _id === valueId);

export const selectFactoryRESTLookup = memoizeFunction((storeSelector: Selector<state, RestStateType>, field = 'name') =>
  createSelector([selectFactoryRESTResponse(storeSelector)], (response: RestStateType["response"]) => {
    const values = cloneDeep(response.Values);

    return values.reduce(function (acc: {[key: string]: any}, value) {
      acc[value._id] = `${value[field]}`;
      return acc;
    }, {});
  }),
);
