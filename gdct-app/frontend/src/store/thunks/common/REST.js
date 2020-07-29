export const customRequestFactory = (store, controller, actionType) => query => dispatch => {
  dispatch(store.actions.REQUEST());

  controller
    .fetch(query)
    .then(values => dispatch(store.actions.ISLOGGEDIN(true)))
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
    });
};

export const getRequestFactory = (store, controller) => query => dispatch => {
  dispatch(store.actions.REQUEST());

  controller
    .fetch(query)
    .then(values => dispatch(store.actions.RECEIVE(values)))
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
    });
};

export const createRequestFactory = (store, controller) => (value, resolve, reject) => dispatch => {
  dispatch(store.actions.REQUEST());

  controller
    .create(value)
    .then(value => {
      dispatch(store.actions.CREATE(value));
      resolve();
    })
    .catch(error => {
      console.error(error);
      dispatch(store.actions.FAIL_REQUEST(error));
      reject();
    });
};

export const deleteRequestFactory = (store, controller) => (_id, resolve, reject) => dispatch => {
  dispatch(store.actions.REQUEST());

  controller
    .delete(_id)
    .then(() => {
      dispatch(store.actions.DELETE(_id));
      resolve();
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      reject();
    });
};

export const updateRequestFactory = (store, controller) => (value, resolve, reject) => dispatch => {
  dispatch(store.actions.REQUEST());

  controller
    .update(value)
    .then(() => {
      dispatch(store.actions.UPDATE(value));
      resolve();
    })
    .catch(error => {
      dispatch(store.actions.FAIL_REQUEST(error));
      reject();
    });
};
