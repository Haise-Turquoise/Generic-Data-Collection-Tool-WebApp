export const CREATE = (state, { payload }) => ({
  response: {
    ...state.response,
    Values: [...state.response.Values, payload],
  },
  isCallInProgress: false,
  error: null,
});

export const DELETE = (state, { payload }) => ({
  response: {
    ...state.response,
    Values: state.response.Values.filter(value => value._id !== payload),
  },
  isCallInProgress: false,
  error: null,
});

export const FAIL_REQUEST = (state, { payload }) => ({
  ...state,
  isCallInProgress: false,
  error: payload,
});

export const RECEIVE = (_state, { payload }) => ({
  response: { Values: payload },
  isCallInProgress: false,
  error: null,
});

export const REQUEST = state => ({
  ...state,
  isCallInProgress: true,
  error: null,
});

export const RESET = () => ({
  response: { Values: [] },
  isCallInProgress: false,
  error: null,
});

export const UPDATE = (state, { payload }) => ({
  response: {
    ...state.response,
    Values: state.response.Values.map(value => (value._id === payload._id ? payload : value)),
  },
  isCallInProgress: false,
  error: null,
});

export const REST_REDUCERS = {
  CREATE,
  DELETE,
  FAIL_REQUEST,
  RECEIVE,
  REQUEST,
  RESET,
  UPDATE,
};
