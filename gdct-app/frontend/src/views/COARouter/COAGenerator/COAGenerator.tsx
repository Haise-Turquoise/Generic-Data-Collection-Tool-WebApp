import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Publish } from '@material-ui/icons';
import ExcelJS, { Worksheet } from 'exceljs';
import COATreeController from '../../../controllers/COATree';
import SheetNameController from '../../../controllers/sheetName';
import COAGroupController from '../../../controllers/COAGroup';
import COAController from '../../../controllers/COA';
import SheetName from '../../../types/sheetname';
import CategoryGroup from '../../../types/categorygroup';
import Category from '../../../types/category';
import CategoryTree from '../../../types/categorytree';
import columnNameController from '../../../controllers/columnName';
import { findLastIndex, split } from 'lodash';

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
  const DBAttributes: Attribute[] = await columnNameController.fetch();
  const allNewAttributes: Attribute[] = [];

  for (let sheetName of Object.keys(data)) {
    // get ID from existing sheetName
    const foundSheet = sheets.find(sheet => sheet.name === sheetName);
    let sheetNameId;
    if (!foundSheet) {
      continue;
    } else {
      sheetNameId = foundSheet._id;
    }

    // for attributes
    // loop through each attribute object and add new attributes to allNewAttributes array
    data[sheetName]['attributes'].forEach(attribute => {
      // check if already in DB or prev added, add if it is not
      const inAllNewAttributes = allNewAttributes.find(addedAttribute => addedAttribute.id.toString() === attribute.id.toString());
      const inAttributeDB = DBAttributes.find(DBAttribute => DBAttribute.id.toString() === attribute.id.toString());
      if (!inAllNewAttributes && !inAttributeDB) {
        allNewAttributes.push(attribute);
      }
    })

    // for categoryTree
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
  // !Note: add code to call controller, unsure of whether to ask controller to run for each attribute or batch import attribute array
  if (allNewAttributes.length > 0) {
    await columnNameController.create(allNewAttributes);
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
  },
  asterisk: {
    color: "red"
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
  const [attributeHeader, setAttributeHeader] = useState('');
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
        if (value.match(/^[a-zA-Z]$/)) {
          setCategoryGroup(value.toUpperCase());
          setErrorMsg("");
          break;
        }
        setErrorMsg("Category Group must be a letter");
        setCategoryGroup('');
        break;
      case 'category':
        if (value.match(/^[a-zA-Z]$/)) {
          setCategory(value.toUpperCase());
          setErrorMsg("");
          break;
        }
        setErrorMsg("Category must be a letter");
        setCategory('');
        break;
      case 'PA':
        if (value.match(/^[a-zA-Z]$/) || value == '') {
          setPA(value.toUpperCase());
          console.log(PA);
          setErrorMsg("");
          break;
        }
        setErrorMsg("PA must be a letter or empty");
        setPA('');
        break;
      case 'SA':
        if (value.match(/^[a-zA-Z]$/) || value == '') {
          setSA(value.toUpperCase());
          setErrorMsg("");
          break;
        }
        setErrorMsg("SA must be a letter or empty");
        setSA('');
        break;
      case 'reportingPeriod':
        setReportingPeriod(value);
        setErrorMsg("");
        setAttributeHeader("")
        // if length of errorMsg is 7 or 10:
        if (value.length == 7 || value.length == 10) {
          if (value.length == 7) {
            // Validate YYYY-YY
            const validator = value.split('-');
            if (parseInt(validator[1]) != (parseInt(validator[0].substring(2, 4)) + 1)) {
              setErrorMsg("Year inputted incorrectly, must be inputted as example follows: 2020-21");
              break;
            }
            setAttributeHeader(validator[0]);
          }
          else if (value.length == 10) {
            // Split by ' '
            let splitYearAndQuarter: string[] = value.split(' ');
            // Follow same logic for YYYY-YY
            const validator = splitYearAndQuarter[0].split('-');
            if (parseInt(validator[1]) != (parseInt(validator[0].substring(2, 4)) + 1)) {
              setErrorMsg("Year inputted incorrectly, must be inputted as example follows: 2020-21");
              break;
            }
            // check last 2 indexes and see if it matches with Q1, Q2, Q3, VE
            const quarters: any = { "Q1": "91", "Q2": "92", "Q3": "93", "YE": "99" }
            if (!(splitYearAndQuarter[1] in quarters)) {
              setErrorMsg("Quarters must be inputted as Q1, Q2, Q3, or YE");
              break;
            }
            setAttributeHeader(validator[0]);
          }
        }
        else if (value.length > 10) {
          setErrorMsg("Reporting Period must be in the format: YYYY-YY or YYYY-YY XX");
          setReportingPeriod("");
        }
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
    if (categoryGroup == '') {
      setErrorMsg("Category Group cannot be empty");
      return;
    }

    if (category == '') {
      setErrorMsg("Category cannot be empty");
      return;
    }
    // If reporting period was inputted incorrectly
    if (attributeHeader == '') {
      setErrorMsg("Reporting Period must be in the format: YYYY-YY or YYYY-YY XX")
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

      if (sheetName == '') {
        // run all of them
        workbook.eachSheet((worksheet: Worksheet, id: number) => {
          let currentSheetName = worksheet.name;
          if (!ignoreSheets.includes(currentSheetName)) {
            allData[currentSheetName] = getSheetData(worksheet, categoryGroupColumn, categoryColumn, unitOfMeasureColumn);
          }
        })
      }
      else {
        const mySheet = workbook.getWorksheet(sheetName);
        // Check if sheetName exists in the workbook
        if (mySheet === undefined) {
          setErrorMsg("Entered Sheet Name does not exist");
          return;
        }
        allData[sheetName] = getSheetData(mySheet, categoryGroupColumn, categoryColumn, unitOfMeasureColumn);

      }
      console.log(allData);
      cb(allData);
    }
  }

  // Function to get attributes and categories from sheet
  const getSheetData = (currentSheet: Worksheet, categoryGroupColumn: number, categoryColumn: number, unitOfMeasureColumn: number) => {
    type returnObject =
      {
        "categoryTree": CatIDType,
        "attributes": Attribute[]
      }

    let returnSheetData: returnObject = {
      "categoryTree": {},
      "attributes": []
    }

    // if attributeRow is number | undefined, cannot use worksheet.getRow(attributeRow)
    // temporary measure is to set it to -1 in the begginning
    let attributeRow: number = -1;
    let attributes: Attribute[] = []

    // search for the "Category" title and note down the row; attribute titles will be on that row
    for (let currentRow = 0; currentRow < currentSheet.rowCount; currentRow++) {
      const row = currentSheet.getRow(currentRow)
      const val = row.getCell(categoryColumn).value?.toString();

      if (typeof val === 'string' && val === "Category") {
        attributeRow = currentRow
        break
      }
    }

    // if "Category" title was found, get all of the cells with attribute titles in that row
    if (attributeRow !== -1) {
      const row = currentSheet.getRow(attributeRow)
      for (let currentColumn = categoryColumn + 1; currentColumn <= currentSheet.columnCount; currentColumn++) {
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

            // store the string into an array and just do an array search
            let attributeId = ''
            const splitHeader = cellValue.split(' ');
            console.log(splitHeader);

            // Iterate through string array, check if number exists in any of the indexes.
            for (let i = 0; i < splitHeader.length; i++) {
              if (/\d/.test(splitHeader[i])) {
                attributeId += splitHeader[i].split('-')[0];
                break;
              }
              // If no number exists, check for Current or Prior
              else if ("Current" === splitHeader[i]) {
                attributeId += attributeHeader.substring(0, 4);
                break;
              }
              else if ("Prior" === splitHeader[i]) {
                attributeId += (parseInt(attributeHeader) - 1).toString();
                break;
              }
            }

            // Identify the Quarter:
            const quarters: any = { "Q1": "91", "Q2": "92", "Q3": "93", "YE": "99" }
            let checker = false;
            for (let i = 0; i < splitHeader.length; i++) {
              if (splitHeader[i] in quarters) {
                attributeId += quarters[splitHeader[i] as string];
                checker = true;
                break;
              }
            }

            if (!checker) {
              attributeId += "99";
            }

            // Determine the type of attribute
            /*   Be aware of the order (put the more specific ones ahead in the object)
            
            Budget: 400
              Annual Budget: 401
            Forecast: 200
              Funding Forecast: 201
            Actual: 300

            Annual Funded .... 
            Adjustment

            */
            const types: any = { "Annual Budget": "401", "Budget": "400", "Funding Forecast": "201", "Forecast": "200", "Actual": "300" };
            for (const [key, value] of Object.entries(types)) {
              if (cellValue.includes(key)) {
                attributeId += value;
                break;
              }
            }

            console.log(attributeId);

            attributes.push({
              name: cellValue,
              id: attributeId,
              updatedAt: (new Date()).toString()
            })
          }
        }
      }
    }
    returnSheetData['attributes'] = attributes

    const categoryIds: CatIDType = {};
    currentSheet.eachRow((row, rowNumber) => {
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
    returnSheetData['categoryTree'] = categoryIds;
    return returnSheetData;
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
            required
            InputLabelProps={{
              classes: {
                asterisk: classes.asterisk
              }
            }}
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
            required
            InputLabelProps={{
              classes: {
                asterisk: classes.asterisk
              }
            }}
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
            required
            InputLabelProps={{
              classes: {
                asterisk: classes.asterisk
              }
            }}
            variant="standard"
            size="small"
            name="reportingPeriod"
            label="ex. 2020-21 Q2"
            value={reportingPeriod}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button variant="contained" color="primary" onClick={processWorkbook}>
        Generate COA
      </Button>
      <br/>
      <Typography>{errorMsg}</Typography>
    </div>
  );
}