import { Dispatch } from "redux";
import { state } from "../types";

const saveFile = (handleSave: (ExcelStore: any) => Promise<void>) => (dispatch: Dispatch, getState: () => state) => {
  //@ts-ignore not referenced anywhere
  dispatch(saveExcelRequest());

  const { ExcelStore } = getState();

  return handleSave(ExcelStore)
    .then(() => {
      //@ts-ignore
      dispatch(finishSaveExcel());
    })
    .catch(error => {
      //@ts-ignore
      dispatch(failSaveExcel(error));
    });
};
