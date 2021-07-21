import { Dispatch, Slice, SliceCaseReducers } from '@reduxjs/toolkit';
import { unauthorized_dialog } from '../../../components/Unauthorized_Dialog/Unauthorized_Dialog';
import { RestStateType, ControllerType } from '../../types';

export const customRequestFactory = (
    store: Slice<RestStateType, SliceCaseReducers<RestStateType>, string>,
    controller: ControllerType,
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
    controller: ControllerType,
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
    controller: ControllerType,
  ) => (
  value: unknown,
  resolve: (value: unknown) => void,
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
    controller: ControllerType,
  ) => (
  _id: string,
  resolve: () => void,
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
    controller: ControllerType,
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
      //@ts-ignore what's happening here
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
