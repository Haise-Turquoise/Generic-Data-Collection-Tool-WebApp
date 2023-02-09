import { state } from "../types";
export const selectOrganizationGroupStore = (state: state) => state.OrganizationGroupStore;
export const selectOrganizationStore = (state: state) => state.OrgsStore;
import { createSelector } from 'reselect';
//@ts-ignore
import cloneDeep from 'clone-deep';
//@ts-ignore
import { memoizeFunction } from '../../tools/misc';
import { RestStateType} from '../types';
import { Selector } from 'react-redux';

const selectFactoryRESTError = memoizeFunction((selector: Selector<state, RestStateType>) =>
  createSelector([selector], store => store.error),
);

const selectFactoryRESTIsCallInProgress = memoizeFunction((selector: Selector<state, RestStateType>) =>
  createSelector([selector], store => store.isCallInProgress),
);

const selectFactoryRESTResponse = memoizeFunction((selector: Selector<state, RestStateType>) =>
  createSelector([selector], store => store.response),
);

const selectFactoryRESTResponseValues = memoizeFunction((selector: Selector<state, RestStateType>) =>
  createSelector([selectFactoryRESTResponse(selector)], (response: RestStateType["response"]) => response.Values),
);

const selectFactoryRESTResponseTableValues = memoizeFunction((selector: Selector<state, RestStateType>) =>
  createSelector([selectFactoryRESTResponseValues(selector)], (response: RestStateType["response"]) =>
    cloneDeep(response.Values),
  ),
);

const selectOrgGroupStore = (store: state) => store.OrganizationGroupStore;

const selectTemplatesStore = (state: state) => state.TemplatesStore;

export {
  selectFactoryRESTError,
  selectFactoryRESTIsCallInProgress,
  selectFactoryRESTResponse,
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTResponseValues,
  selectOrgGroupStore,
  selectTemplatesStore,
};
