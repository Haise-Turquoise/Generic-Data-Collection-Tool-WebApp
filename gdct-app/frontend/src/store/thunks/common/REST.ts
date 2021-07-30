import { Dispatch, Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { unauthorized_dialog } from '../../../components/Unauthorized_Dialog/Unauthorized_Dialog';
import { RestStateType, ControllerType, UserStateType } from '../../types';

export const customRequestFactory = <T = RestStateType | UserStateType>(
    store: Slice<T, SliceCaseReducers<T>, string>,
    controller: { fetch: ControllerType["fetch"] },
  ) => (query: any) => (dispatch: Dispatch) => {
  dispatch(store.actions.REQUEST(''));

  controller
    .fetch(query)
    .then(values => dispatch(store.actions.ISLOGGEDIN(true)))
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
    });
};

export const getRequestFactory = (
    store: Slice<RestStateType, SliceCaseReducers<RestStateType>, string>,
    controller: { fetch: ControllerType["fetch"], fetchPopulated?: ControllerType["fetchPopulated"] },
  ) => (
  query?: any,
  resolve?: () => void,
  reject?: () => void,
  isPopulated = false,
) => (dispatch: Dispatch) => {
  dispatch(store.actions.REQUEST(''));

  controller[(controller.fetchPopulated && isPopulated) ? 'fetchPopulated' : 'fetch']!(query)
    .then(values => {
      if (values === 'UNAUTHORIZED ACCESS') {
        unauthorized_dialog();
      } else {
        dispatch(store.actions.RECEIVE(values));
        if (resolve) resolve();
      }
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      if (reject) reject();
    });
};

export const createRequestFactory = (
    store: Slice<RestStateType, SliceCaseReducers<RestStateType>, string>,
    controller: { create: ControllerType["create"], createPopulated?: ControllerType["createPopulated"] },
  ) => (
  value: unknown,
  resolve: (value: any) => void,
  reject: () => void,
  isPopulated = false,
) => (dispatch: Dispatch) => {
  dispatch(store.actions.REQUEST(''));

  controller[isPopulated && controller.createPopulated ? 'createPopulated' : 'create']!(value)
    .then(value => {
      dispatch(store.actions.CREATE(value));
      if (resolve) resolve(value);
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      if (reject) reject();
    });
};

export const deleteRequestFactory = (
    store: Slice<RestStateType, SliceCaseReducers<RestStateType>, string>,
    controller: { delete: ControllerType["delete"], deletePopulated?: ControllerType["deletePopulated"] },
  ) => (
  _id: string,
  resolve: (value?: any) => void,
  reject: () => void,
  isPopulated = false,
) => (dispatch: Dispatch) => {
  dispatch(store.actions.REQUEST(''));

  controller[isPopulated && controller.deletePopulated ? 'deletePopulated' : 'delete']!(_id)
    .then(() => {
      dispatch(store.actions.DELETE(_id));
      if (resolve) resolve();
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      if (reject) reject();
    });
};

export const updateRequestFactory = (
    store: Slice<RestStateType, SliceCaseReducers<RestStateType>, string>,
    controller: { update: ControllerType["update"], updatePopulated?: ControllerType["updatePopulated"] },
  ) => (
  value: unknown,
  resolve = (value?: any) => {},
  reject = () => {},
  isPopulated = false,
  populatedData = {},
) => (dispatch: Dispatch) => {
  dispatch(store.actions.REQUEST(''));
  controller[isPopulated && controller.updatePopulated ? 'updatePopulated' : 'update']!(value)
    .then(values => {
      if (values.data === 'UNAUTHORIZED ACCESS') {
        unauthorized_dialog();
      } else {
        dispatch(store.actions.UPDATE(isPopulated ? populatedData : value));
        if (resolve) resolve(value);
      }
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      if (reject) reject();
    });
};
