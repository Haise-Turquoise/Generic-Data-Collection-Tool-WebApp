export const updateObject = (oldObject, newValues) => ({ ...oldObject, ...newValues });

export const createReducer = (initialState, handlers) => (state = initialState, action) => {
  if (handlers.hasOwnProperty(action.type)) {
    return handlers[action.type](state, action);
  }
  return state;
};
