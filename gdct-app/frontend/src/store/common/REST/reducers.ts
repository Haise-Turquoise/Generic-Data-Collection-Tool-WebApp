import { CaseReducer, SliceCaseReducers } from "@reduxjs/toolkit";
import { Action, Reducer } from "redux";
import { RestStateReducers, RestStateType, responseVal } from "../../types";

export const CREATE: CaseReducer<RestStateType, {type: string, payload: any}> = (state, { payload }) => ({
  response: {
    ...state!.response,
    Values: [...state!.response.Values, payload],
  },
  isCallInProgress: false,
  error: null,
});

export const DELETE: CaseReducer<RestStateType, {type: string, payload: string}> = (state, { payload }) => ({
  response: {
    ...state!.response,
    Values: state!.response.Values.filter((value: responseVal) => value._id !== payload),
  },
  isCallInProgress: false,
  error: null,
});

export const FAIL_REQUEST: CaseReducer<RestStateType, {type: string, payload: string}> = (state, { payload }) => ({
  ...state!,
  isCallInProgress: false,
  error: payload,
});

export const RECEIVE: CaseReducer<RestStateType, {type: string, payload: responseVal[]}> = (_state, { payload }) => ({
  response: { Values: payload },
  isCallInProgress: false,
  error: null,
});

export const REQUEST: CaseReducer<RestStateType, {type: string}> = (state) => ({
  ...state!,
  isCallInProgress: true,
  error: null,
});

export const RESET: CaseReducer<RestStateType, {type: string}> = () => ({
  response: { Values: [] },
  isCallInProgress: false,
  error: null,
});

export const UPDATE: CaseReducer<RestStateType, {type: string, payload: responseVal}> = (state, { payload }) => ({
  response: {
    ...state!.response,
    Values: state!.response.Values.map((value: responseVal) => (value._id === payload._id ? payload : value)),
  },
  isCallInProgress: false,
  error: null,
});

export const REST_REDUCERS: SliceCaseReducers<RestStateType> = {
  CREATE,
  DELETE,
  FAIL_REQUEST,
  RECEIVE,
  REQUEST,
  RESET,
  UPDATE,
};
