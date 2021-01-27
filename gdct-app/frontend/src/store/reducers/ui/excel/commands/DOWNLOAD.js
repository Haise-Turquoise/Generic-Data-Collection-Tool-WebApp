// ! Does not update the state
// ! Performance optimization. If this were used in sheet, it will listen to too many events?

import { downloadWorkbook } from '../../../../../tools/excel';

const DOWNLOAD = (state, UserFeedback) => {
  const { name, activeSheetName, inactiveSheets } = state;

  const sheets = {
    ...inactiveSheets,
    [activeSheetName]: state,
  };

  downloadWorkbook(name, activeSheetName, sheets);
  // setUserFeedback('DOwnload Successfully !')
  // console.log('get userFeedback')
  // UserFeedback('Download successfully !')
  return state;
};

export default DOWNLOAD;
