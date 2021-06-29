//@ts-ignore
import COATreeController from '../../controllers/COATree';

const DetectEmptySheet = async (sheetNameId: string) => {
  console.log(sheetNameId);
  //assign async function call's returned value using sheetNameId to the new variable, COATree
  const COATree = await COATreeController.fetchBySheetName(sheetNameId);
  console.log(COATree);
  //if sheetname doesn't contain Category Tree,
  if (COATree.length === 0) {
    return true;
  }
  return false;
};

export default DetectEmptySheet;
