import thunk from 'redux-thunk';
import { configureStore } from '@reduxjs/toolkit';
//@ts-ignore
import rootReducer from './reducer';
import { combineReducers,Action } from 'redux';

const devTools = {
  // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
  actionSanitizer: (action) => {
    switch (action.type) {
      case 'EXCEL_SET_EXCEL_DATA':
        return {
          ...action,
          excelData: {
            ...action.excelData,
            inactiveSheets: '<<LONG_BLOB>>',
          },
        };
      default:
        return action;
    }
  },
  stateSanitizer: (state) => ({
    ...state,
    ui: {
      ...state.ui,
      excel: {
        ...state.ui.excel,
        inactiveSheets: '<<LONG_BLOB>>',
      },
    },
  }),
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
  devTools,
});

export default store;
