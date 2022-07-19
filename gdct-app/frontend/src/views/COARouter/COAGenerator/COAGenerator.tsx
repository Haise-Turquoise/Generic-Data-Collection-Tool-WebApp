import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
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
import columnNameController from '../../../controllers/columnName';
import { findLastIndex } from 'lodash';

import Attribute from '../../../types/attribute';

let workbook = new ExcelJS.Workbook();

const ignoreSheets = ['Main Menu', 'Identification'];

type CatIDType = {
  [categoryGroup: string]: Category[]
}
type AllDataType = {
  [sheetName: string]: {
    categoryTree: CatIDType,
    attributes: Attribute[]
  }
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

// !Note: Remove constants, uneeded
const constants = {
  ID: colToInt('A'),
  GROUP_NAME: colToInt('E'),
  NAME: colToInt('F'),
  UNIT: colToInt('H'),
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
    for (let ctgGroup of Object.keys(data[sheetName]['categoryTree'])) {
      const newCategories: Category[] = data[sheetName]['categoryTree'][ctgGroup];
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
        // foundGroup = await COAGroupController.create({
        //   name: ctgGroup,
        //   updatedAt: (new Date()).toString(),
        //   updatedBy: localStorage.getItem('currentUser') || '',
        // });
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
    // await COAController.create(allNewCategories);
  }
  console.log('!debug line 138')
  console.log(objects)
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
    // COATreeController.create(trees);
  }
};

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  parameters: {
    width: '30em',
    marginTop: '1em',
    marginBottom: '1em',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5em',
    marginBottom: '0.5em',
    alignItems: 'center',
    justifySelf: 'center',
  }
});

/**
 * The functional component to handle file upload/processing
 * @returns The JSX component
 */
export default function COAGenerator() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');

  // State Variables
  const [sheetName, setSheetName] = useState('');
  const [categoryGroup, setCategoryGroup] = useState('');
  const [category, setCategory] = useState('');
  const [PA, setPA] = useState('');
  const [SA, setSA] = useState('')
  const [reportingPeriod, setReportingPeriod] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const classes = useStyles();

  const handleFileUpload = (e: FormEvent<HTMLInputElement>) => {
    if (!e || !e.currentTarget || !e.currentTarget.files) {
      console.log('no files')
      return
    }
    setFile(e.currentTarget.files[0]);
    setFileName(e.currentTarget.files[0].name);
  };

  const handleChange = (e: ChangeEvent<{ name?: string, value: string }>) => {
    const { name, value } = e.target;
    // const updatedErrors = { ...errors };

    switch (name) {
      case 'sheetName':
        setSheetName(value);
        break;
      case 'categoryGroup':
        setCategoryGroup(value);
        setErrorMsg("");
        if (!value.match(/^[A-Z]*$/)) {
          setErrorMsg("Category Group must be a capital letter");
          setCategoryGroup('');
        }
        break;
      case 'category':
        setCategory(value);
        setErrorMsg("");
        if (!value.match(/^[A-Z]*$/) && value != '') {
          setErrorMsg("Category must be a capital letter");
          setCategory('');
        }
        break;
      case 'PA':
        setPA(value);
        setErrorMsg("");
        if (!value.match(/^[A-Z]*$/) && value != '') {
          setErrorMsg("PA must be a capital letter or empty");
          setPA('');
        }
        break;
      case 'SA':
        setSA(value);
        setErrorMsg("");
        if (!value.match(/^[A-Z]*$/)) {
          setErrorMsg("SA must be a capital letter or empty");
          setSA('');
        }
        break;
      case 'reportingPeriod':
        setReportingPeriod(value);
        break;
      default:
    }
  };

  // process current File
  const processWorkbook = () => {
    setErrorMsg("");
    if (!file) {
      setErrorMsg('No File Uploaded');
      return;
    }
    // Check state variables to see if they are valid for reading
    // Check sheet name:
    if (sheetName == '') {
      setErrorMsg("Sheet Name cannot be empty");
      return;
    }

    if (categoryGroup == '') {
      setErrorMsg("Category Group cannot be empty");
      return;
    }

    if (category == '') {
      setErrorMsg("Category cannot be empty");
      return;
    }

    processData(file, data => buildObjects(data).then((trees) => {
      if (trees) {
        createTrees(trees as CategoryTree[])
      }
    }), colToInt(categoryGroup), colToInt(category), colToInt('H'));
  };

  /**
   * Async processes the data from a spreadsheet file
   * @param file - The spreadsheet file to process
   * @param cb - The function to call with the processed data
   */
  const processData = async (file: File, cb: (allData: AllDataType) => void, categoryGroupColumn: number, categoryColumn: number, unitOfMeasureColumn: number) => {
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

      const mySheet = workbook.getWorksheet(sheetName);
      // Check if sheetName exists in the workbook
      if (mySheet === undefined) {
        setErrorMsg("Entered Sheet Name does not exist");
        return;
      }

      if (ignoreSheets.includes(mySheet.name)) {
        return;
      }

      allData[mySheet.name] = {
        "categoryTree": {},
        "attributes": []
      }

      // if attributeRow is number | undefined, cannot use worksheet.getRow(attributeRow)
      // temporary measure is to set it to -1 in the begginning
      let attributeRow: number = -1;
      let attributes: Attribute[] = []

      // search for the "Category" title and note down the row; attribute titles will be on that row
      for (let currentRow = 0; currentRow < mySheet.rowCount; currentRow++) {
        const row = mySheet.getRow(currentRow)
        const val = row.getCell(categoryColumn).value?.toString();

        if (typeof val === 'string' && val === "Category") {
          attributeRow = currentRow
          break
        }
      }

      // if "Category" title was found, get all of the cells with attribute titles in that row
      if (attributeRow !== -1) {
        const row = mySheet.getRow(attributeRow)
        for (let currentColumn = categoryColumn + 1; currentColumn <= mySheet.columnCount; currentColumn++) {
          const cellValue = row.getCell(currentColumn).value?.toString()

          // add valid attributes to the attributes array
          if (typeof cellValue === 'string') {
            const attributesToIgnore: string[] = ['Line #', 'Reference', 'Unit of Measure', 'Notes', 'Comments', 'Definitions', 'Variance']
            let isValid: boolean = true
            attributesToIgnore.forEach((attribute: string) => {
              if (cellValue.includes(attribute)) {
                isValid = false
              }
            })

            if (isValid) {
              // remove currentYear filter
              // determine the attribute ID (ADD LOGIC HERE)!*
              let attributeId = ''
              attributeId += cellValue.split(' ')[0].split('-')[0] //first year (might try reg)

              attributes.push({
                _id: '',
                name: cellValue,
                id: attributeId,
                updatedAt: (new Date()).toString()
              })
            }
          }
        }
      }
      allData[mySheet.name]['attributes'] = attributes

      const categoryIds: CatIDType = {};
      mySheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0) {
          return;
        }
        // !Note: colToInt('A') is the id column, unsure how to handle
        const id = row.getCell(colToInt('A')).value;
        let groupName: string | undefined = row.getCell(categoryGroupColumn).value?.toString();
        if (typeof groupName === 'string' && groupName.split(' ')[0] === 'Total') {
          groupName = groupName.replace('Total ', '');
        }
        const name: string | undefined = row.getCell(categoryColumn).value?.toString();
        const unitOfMeasure: string = row.getCell(unitOfMeasureColumn).value?.toString() || '';

        if (id && typeof id === 'number' && groupName && name) {
          if (!categoryIds[groupName]) {
            categoryIds[groupName] = [];
          }
          if (name.split(' ')[0].toLowerCase() !== 'total') {
            categoryIds[groupName].push({ id: id.toString(), name, unitOfMeasure, COA: "", updatedAt: (new Date()).toString() });
          }
        }
      });
      allData[mySheet.name]['categoryTree'] = categoryIds;

      console.log("!debug line 402")
      console.log(allData)
      cb(allData);
    };
  };

  return (
    <div className={classes.container}>
      <Typography>{fileName && `Uploaded: ${fileName}`}</Typography>
      <Button variant="contained" startIcon={<Publish />} component="label">
        Upload File
        <br />
        <input type="file" accept=".xlsx" hidden onChange={handleFileUpload} />
      </Button>

      <div className={classes.parameters}>
        <div className={classes.item}>
          <text>Sheet Name:</text>
          <TextField
            variant="standard"
            size="small"
            name="sheetName"
            label="Enter Sheet Name"
            onChange={handleChange}
          />
        </div>

        <div className={classes.item}>
          Category Group:
          <TextField
            variant="standard"
            size="small"
            name="categoryGroup"
            id="categoryGroup"
            label="Enter Column Index"
            value={categoryGroup}
            onChange={handleChange}
          />
        </div>

        <div className={classes.item}>
          Category:
          <TextField
            variant="standard"
            size="small"
            name="category"
            label="Enter Column Index"
            value={category}
            onChange={handleChange}
          />
        </div>

        <div className={classes.item}>
          OHFS Mapping Column:
          <div>
            <TextField
              variant="standard"
              size="small"
              name="PA"
              label="PA"
              value={PA}
              style={{ width: '3em', marginRight: '2em' }}
              onChange={handleChange}
            />
            <TextField
              variant="standard"
              size="small"
              name="SA"
              label="SA"
              value={SA}
              style={{ width: '3em' }}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className={classes.item}>
          Reporting Period:
          <TextField
            variant="standard"
            size="small"
            name="reportingPeriod"
            label="ex. 2020/21 Q2"
            value={reportingPeriod}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button variant="contained" color="primary" onClick={processWorkbook}>
        Generate COA
      </Button>
      <Typography>{errorMsg}</Typography>
    </div>
  );
}