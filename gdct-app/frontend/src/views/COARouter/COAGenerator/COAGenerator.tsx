import React, { useState, FormEvent } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Publish } from '@material-ui/icons';
import ExcelJS from 'exceljs';
import COATreeController from '../../../controllers/COATree';
import SheetNameController from '../../../controllers/sheetName';
import COAGroupController from '../../../controllers/COAGroup';
import COAController from '../../../controllers/COA';
import SheetName from '../../../types/sheetname';
import CategoryGroup from '../../../types/categorygroup';
import Category from '../../../types/category';
import CategoryTree from '../../../types/categorytree';
let workbook = new ExcelJS.Workbook();

const ignoreSheets = ['Main Menu', 'Identification'];

type CatIDType = {
  [categoryGroup: string]: Category[]
}
type AllDataType = {
  [sheetName: string]: CatIDType
}

/*
* Sample obejct structure for AllDataType
{
  sheetName1: {
    categoryGroup1: [{
      ...Category1
    }],
    categoryGroup2: [
      {
        ...Category2
      },
      {
        ...Category3
      }
    ]
  },
  sheetName2: {
    ...
  },
}
*/

/**
 * Converts a column string ex: AA to an integer
 * @param {string} col - The column string
 * @returns The converted integer
 */
const colToInt = (col: string) => {
  let res = 0,
    base = 1;

  while (col.length > 0) {
    res += (col.charCodeAt(col.length - 1) - 'A'.charCodeAt(0) + 1) * base;

    base *= 26;

    col = col.substring(0, col.length - 1);
  }

  return Math.max(res, 1);
};

const constants = {
  ID: colToInt('A'),
  GROUP_NAME: colToInt('E'),
  NAME: colToInt('F'),
  UNIT: colToInt('I'),
};

/**
 * Async processes the data from a spreadsheet file
 * @param file - The spreadsheet file to process
 * @param cb - The function to call with the processed data
 */
const processData = async (file: File, cb: (allData: AllDataType) => void) => {
  let reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // reads necessary data
  reader.onload = async () => {
    const data = reader.result;
    if (!data || typeof data === "string") {
      return
    }
    workbook = await workbook.xlsx.load(data);
    let allData: AllDataType = {};

    workbook.eachSheet((worksheet: ExcelJS.Worksheet, sheetId: number) => {
      if (ignoreSheets.includes(worksheet.name)) {
        return;
      }
      const categoryIds: CatIDType = {};
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0) {
          return;
        }
        const id = row.getCell(constants.ID).value;
        let groupName: string | undefined = row.getCell(constants.GROUP_NAME).value?.toString();
        if (typeof groupName === 'string' && groupName.split(' ')[0] === 'Total') {
          groupName = groupName.replace('Total ', '');
        }
        const name: string | undefined = row.getCell(constants.NAME).value?.toString();
        const unitOfMeasure: string = row.getCell(constants.UNIT).value?.toString() || '';
        if (id && typeof id === 'number' && groupName && name) {
          if (!categoryIds[groupName]) {
            categoryIds[groupName] = [];
          }
          if (name.split(' ')[0].toLowerCase() !== 'total') {
            categoryIds[groupName].push({ id: id.toString(), name, unitOfMeasure, COA: "", updatedAt: (new Date()).toString() });
          }
        }
      });
      allData[worksheet.name] = categoryIds;
    });
    cb(allData);
  };
};

/**
 * Builds all tree objects from processed data 
 * @param data - the data processed in processData()
 * @returns an array of CategoryTrees
 */
const buildObjects = async (data: AllDataType) => {
  const objects: CategoryTree[] = [];
  const groups: CategoryGroup[] = await COAGroupController.fetch();
  const sheets: SheetName[] = await SheetNameController.fetch();
  const categories: Category[] = await COAController.fetch();
  const allNewCategories: Category[] = [];
  for (let sheetName of Object.keys(data)) {
    // get ID from existing sheetName
    const foundSheet = sheets.find(sheet => sheet.name === sheetName);
    let sheetNameId;
    if (!foundSheet) {
      continue;
    } else {
      sheetNameId = foundSheet._id;
    }
    for (let ctgGroup of Object.keys(data[sheetName])) {
      const newCategories: Category[] = data[sheetName][ctgGroup];
      // add new categories to a list that will be added to DB later
      newCategories.forEach(category => {
        const inAllCat = allNewCategories.find(cat => cat.id.toString() === category.id.toString());
        const inDBCat = categories.find(cat => cat.id.toString() === category.id.toString());
        if (!inAllCat && !inDBCat) {
          allNewCategories.push(category);
        }
      });

      // get categoryId
      const categoryId = newCategories.map(obj => obj.id.toString());
      // get categoryGroupId
      let foundGroup: CategoryGroup | undefined | null = groups.find(group => group.name === ctgGroup);
      if (!foundGroup) {
        foundGroup = await COAGroupController.create({
          name: ctgGroup,
          updatedAt: (new Date()).toString(),
          updatedBy: localStorage.getItem('currentUser') || '',
        });
      }
      const categoryGroupId = foundGroup?._id || '';
      objects.push({
        _id: undefined,
        categoryId,
        sheetNameId,
        categoryGroupId,
        updatedBy: localStorage.getItem('currentUser') || '',
      });
    }
  }
  if (allNewCategories.length > 0) {
    await COAController.create(allNewCategories);
  }
  return objects;
};

/**
 * Populate database with created trees - checks for duplicates
 * @param trees - The trees created in buildObejcts()
 */
const createTrees = async (trees: CategoryTree[]) => {
  const currTrees: CategoryTree[] = await COATreeController.fetch();
  // remove trees already in the database
  trees = trees.filter(tree => {
    const found = currTrees.find(
      currTree =>
        currTree.categoryGroupId &&
        (currTree.categoryGroupId as CategoryGroup)._id === tree.categoryGroupId &&
        currTree.sheetNameId === tree.sheetNameId,
    );
    return !found;
  });
  // send any remaining trees
  if (trees.length > 0) {
    COATreeController.create(trees);
  }
};

const useStyles = makeStyles({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});

/**
 * The functional component to handle file upload/processing
 * @returns The JSX component
 */
export default function COAGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  const classes = useStyles();

  const handleFileUpload = (e: FormEvent<HTMLInputElement>) => {
    if (!e || !e.currentTarget || !e.currentTarget.files) {
      console.log('no files')
      return
    }
    setFile(e.currentTarget.files[0]);
    setFileName(e.currentTarget.files[0].name);
  };

  // process current File
  const processWorkbook = () => {
    if (!file) {
      console.log('no file')
      return;
    }
    processData(file, data => buildObjects(data).then((trees) => {
      if (trees) {
        createTrees(trees as CategoryTree[])
      }
    }));
  };

  return (
    <div className={classes.container}>
      <Typography>{fileName && `Uploaded: ${fileName}`}</Typography>
      <Button variant="contained" startIcon={<Publish />} component="label">
        Upload File
        <br />
        <input type="file" accept=".xlsx" hidden onChange={handleFileUpload} />
      </Button>
      <Button variant="contained" color="primary" onClick={processWorkbook}>
        Generate COA
      </Button>
    </div>
  );
}
