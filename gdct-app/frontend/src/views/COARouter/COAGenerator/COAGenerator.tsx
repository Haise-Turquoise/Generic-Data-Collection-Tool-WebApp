import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Publish } from '@material-ui/icons';
import ExcelJS, { Worksheet } from 'exceljs';
import SheetName from '../../../types/sheetname';
import CategoryTree from '../../../types/categorytree';
import CategoryGroup from '../../../types/categorygroup';
import Category from '../../../types/category';
import Attribute from '../../../types/attribute';
import AttributeConfig from '../../../types/attributeconfig';
import SheetNameController from '../../../controllers/sheetName';
import COATreeController from '../../../controllers/COATree';
import COAGroupController from '../../../controllers/COAGroup';
import COAController from '../../../controllers/COA';
import ColumnNameController from '../../../controllers/columnName';
import AttributeConfigController from '../../../controllers/AttributeConfig';
import Swal from 'sweetalert2';

let workbook = new ExcelJS.Workbook();

const ignoreSheets = ['Main Menu', 'Identification'];

/*
Each message will have contents (text) and an html tag (p, h1, h2, class="", etc.)
This is so the Swal output message can be styled by bootstrap
*/
type generateLogMessage = {
  content: string,
  html: string
}

/*
The output message type
message: An array of messages to display
type: code has an if statement to check this property, which will change the
icon of the Swal output message (currently if statement only has success or error)
*/
type generateLogType = {
  message: generateLogMessage[],
  type: string
}

let generateLog: generateLogType = {
  message: [],
  type: "success"
}

/*
CatIDType is a type for categoryTrees
Example object:
{
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
  s
*/
type CatIDType = {
  [categoryGroup: string]: Category[]
}

/*
Sample object structure for AllDataType
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
type AllDataType = {
  [sheetName: string]: {
    categoryTree: CatIDType,
    attributes: Attribute[]
  }
}

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

/**
 * Builds all tree objects from processed data 
 * @param data - the data processed in processData()
 * @returns an array of CategoryTrees
 */
const buildObjects = async (data: AllDataType) => {
  let objects: CategoryTree[] = [];
  // tempObjects holds data which is then converted to CategoryTree[] for objects
  const tempObjects = [];

  // !Note: .fetch fetches all from DB and is slow
  const groups: CategoryGroup[] = await COAGroupController.fetch();
  const sheets: SheetName[] = await SheetNameController.fetch();
  const categories: Category[] = await COAController.fetch();
  const DBAttributes: Attribute[] = await ColumnNameController.fetch();
  const allNewCategories: Category[] = [];
  const allNewAttributes: Attribute[] = [];
  const allNewGroups: CategoryGroup[] = [];

  // handle input data, add new attributes, categories, category groups to DB
  // create a categoryTree object array (each array item is a categoryTree for a sheet)
  for (let sheetName of Object.keys(data)) {
    // get ID from existing sheetName, don't create categoryTree if no ID
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
        // make new group
        const newGroup: CategoryGroup = {
          name: ctgGroup,
          updatedAt: new Date().toString(),
          updatedBy: localStorage.getItem('currentUser') || '',
        }
        allNewGroups.push(newGroup)
      }
      // add categoryGroup name, which will be converted to categoryGroup ID later
      tempObjects.push({
        categoryId,
        sheetNameId,
        ctgGroup,
      });
    }
  }

  // for output message
  generateLog.message.push({ content: "Total Summary:", html: "h4 class=\"pl-0\"" })
  generateLog.message.push({ content: `Added ${allNewGroups.length} Category Groups`, html: "p" })
  generateLog.message.push({ content: `Added ${allNewAttributes.length} Attributes`, html: "p" })
  generateLog.message.push({ content: `Added ${allNewCategories.length} Categories`, html: "p" })

  // for adding new groups, attributes, and categories into the database
  if (allNewGroups.length > 0) {
    await COAGroupController.create(allNewGroups)
  }
  if (allNewAttributes.length > 0) {
    await ColumnNameController.create(allNewAttributes);
  }
  if (allNewCategories.length > 0) {
    await COAController.create(allNewCategories);
  }

  // convert tempObjects to valid categoryTree[] for objects
  // mainly by changing categoryGroup name to categoryGroup ID
  const newGroups: CategoryGroup[] = await COAGroupController.fetch();
  objects = tempObjects.map((object) => {
    let foundGroup: CategoryGroup | undefined | null = newGroups.find(group => group.name === object.ctgGroup);
    const categoryGroupId = foundGroup?._id || ''

    return ({
      _id: undefined,
      "categoryId": object.categoryId,
      "sheetNameId": object.sheetNameId,
      categoryGroupId,
      updatedBy: localStorage.getItem('currentUser') || '',
    })
  })
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

// Check Excel Importer folder in team files for documentation
const validToken = (_token: string) => {
  const token = _token.trim();
  return (token.length > 0 && token.split(' ').length <= 1);
}

// Check Excel Importer folder in team files for documentation
const validSelector = (_token: string) => {
  const token = _token.trim();

  if (token.match(/(\s|^)\d{1,4}(\s|$)/ig)) return false;
  if (token.match(/\sto\s/ig)) {
    const tokens = token.split(/\sto\s/ig);
    if (tokens.length != 2) return false;
    else return validToken(tokens[0]) && validToken(tokens[1]);
  } else return validToken(token);
}

// Check Excel Importer folder in team files for documentation
const parseCOA = (inp: string = '') => {
  const REMOVE_WORDS = /(?<![a-zA-Z0-9~\*\&:])[A-Z\.\-:]+(?![a-zA-Z0-9~\*\&:])(?<![^a-zA-Z0-9~\*\&:]TO)/ig;
  const code = inp;
  const segments = code.replace(REMOVE_WORDS, '').split(/[\[\]\(\)\<\>]/);

  let include: string[] = [], exclude: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    let block = segments[i];
    for (let j = 0; j < block.length; j++) {
      if (block.charAt(j) == '*' && (j + 1) != block.length && block.charAt(j + 1) != " " && block.charAt(j + 1) != ",") {
        block = block.substring(0, j) + "~" + block.substring(j + 1)
      }
    }

    if (i & 1)
      exclude = exclude.concat(block.split(/,/g));
    else
      include = include.concat(block.split(/,/g));
  }
  include = include.filter(block => validSelector(block)).map(block => block.replace(/\s/g, ''));
  exclude = exclude.filter(block => validSelector(block)).map(block => block.replace(/\s/g, ''));

  return {
    include: include.join('_') || '',
    exclude: exclude.join('_') || ''
  };
}

// Check Excel Importer folder in team files for documentation
const convertToQuery = (PA: string, SA: string) => {
  const {
    include: PA_inc,
    exclude: PA_exc
  } = parseCOA(PA);

  const {
    include: SA_inc,
    exclude: SA_exc
  } = parseCOA(SA);

  if (SA_inc.length > 0) {
    return `pa=${PA_inc}` +
      (PA_exc.length > 0 ? `&exclude=${PA_exc}` : "") +
      `&sa=${SA_inc}` +
      (SA_exc.length > 0 ? `&exclude=${SA_exc}` : "")
  }
  else if (PA_inc.length > 0) {
    return `pa=${PA_inc}` +
      (PA_exc.length > 0 ? `exclude=${PA_exc}` : "")
  }
  else return ''
}

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
    if (!e || !e.currentTarget || !e.currentTarget.files || !e.currentTarget.files[0]) {
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
        setReportingPeriod(value.toUpperCase());
        setErrorMsg("");
        setAttributeHeader("")
        // if length of errorMsg is 7 or 10:
        if (value.length == 7 || value.length == 10) {
          if (value.length == 7) {
            // Validate YYYY-YY
            let validator: string[];
            validator = ["", ""];
            if (value.charAt(4) == '/') {
              validator = value.split('/')
            }
            else {
              validator = value.split('-');
            }
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
            let validator: string[];
            validator = ["", ""];
            if (value.charAt(4) == '/') {
              validator = splitYearAndQuarter[0].split('/')
            }
            else {
              validator = splitYearAndQuarter[0].split('-');
            }
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
          setErrorMsg("Reporting Period must be in the format: YYYY-YY, YYYY/YY, YYYY-YY XX or YYYY/YY XX");
          setReportingPeriod("");
        }
        break;
      default:
    }
  };

  /*
  Handles current file, checks if file and inputs are valid
  If valid, calls processData() and buildObjects() callback
  to create categoryTree[] (one array item per sheet), then adds to DB
  */
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

    if (categoryGroup === category || categoryGroup === PA || categoryGroup === SA) {
      setErrorMsg("Category Group cannot be the same index as Category, PA, or SA");
      setCategoryGroup('');
      return;
    }

    if (category == '') {
      setErrorMsg("Category cannot be empty");
      return;
    }

    if (categoryGroup === category || category === PA || category === SA) {
      setErrorMsg("Category cannot be the same index as Category Group, PA, or SA");
      setCategory('');
      return;
    }

    // Cases when PA and SA are non-empty
    if (PA != '') {
      if (PA === categoryGroup || PA === category || PA === SA) {
        setErrorMsg("PA cannot be the same index as Category Group, Category, or SA");
        setPA('');
        return;
      }
    }

    if (SA != '') {
      if (SA === categoryGroup || SA === category || PA === SA) {
        setErrorMsg("SA cannot be the same index as Category Group, Category, or PA");
        setSA('');
        return;
      }
    }

    // If reporting period was inputted incorrectly
    if (attributeHeader == '') {
      setErrorMsg("Reporting Period must be in the format: YYYY-YY, YYYY/YY, YYYY-YY XX or YYYY/YY XX")
      return;
    }

    processData(file, data => buildObjects(data).then((trees) => {
      if (trees) {
        createTrees(trees as CategoryTree[])
      }

      // send output message using generateLog 
      let messageHTML = "<div class=\"d-flex flex-column align-items-start\">"
      generateLog.message.forEach(item => {
        messageHTML += `<${item.html}>${item.content}</${item.html}>`
      })
      messageHTML += "</div>"

      // check what type of Swal message should be sent
      if (generateLog.type === "success") {
        Swal.fire({
          title: 'Import Was Successfull!',
          icon: "success",
          html: messageHTML
        })
      }
      else {
        Swal.fire({
          title: 'The Import Had Errors, Please See Below',
          icon: "error",
          html: messageHTML
        })
      }

      generateLog = {
        message: [],
        type: "success",
      }
    }), colToInt(categoryGroup), colToInt(category));
  };

  /**
   * Async processes the data from a spreadsheet file
   * @param file - The spreadsheet file to process
   * @param cb - The function to call with the processed data
   */
  const processData = async (file: File, cb: (allData: AllDataType) => void, categoryGroupColumn: number, categoryColumn: number) => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    // reads necessary data
    reader.onload = async () => {
      const data = reader.result;
      if (!data || typeof data === "string") {
        return
      }
      const attributeIdMap = await AttributeConfigController.fetch()
      workbook = await workbook.xlsx.load(data);
      let allData: AllDataType = {};

      // if no sheetName specified, get data of all sheets
      if (sheetName == '') {
        workbook.eachSheet(async (worksheet: Worksheet, id: number) => {
          let currentSheetName = worksheet.name;
          if (!ignoreSheets.includes(currentSheetName)) {
            generateLog.message.push({ content: "Importing " + currentSheetName, html: "h4 class=\"pl-0 mt-4 text-left\"" })
            allData[currentSheetName] = await getSheetData(worksheet, attributeIdMap, categoryGroupColumn, categoryColumn);
          }
        })
      }
      // else get data from sheetName sheet only
      else {
        const mySheet = workbook.getWorksheet(sheetName);
        // Check if sheetName exists in the workbook
        if (mySheet === undefined) {
          setErrorMsg("Entered Sheet Name does not exist");
          return;
        }
        if (!ignoreSheets.includes(sheetName)) {
          generateLog.message.push({ content: "Importing " + sheetName, html: "h4 class=\"pl-0 mt-4 text-left\"" })
          allData[sheetName] = await getSheetData(mySheet, attributeIdMap, categoryGroupColumn, categoryColumn);
        }
      }
      console.log('!debug line 381')
      console.log(allData);
      cb(allData);
    }
  }

  /**
  * Given an attribute name, create a matching attribute Id
  * @param cellValue: string holding attribute name
  * @param attributeIdMap: array of all attribute configs from database (used for last digits)
  * Output: string with either an attribute ID or msg saying "Config Not In DB" 
  */
  const makeAttributeId = (cellValue: string, attributeIdMap: AttributeConfig[]) => {
    // store the string into an array and just do an array search
    let attributeId = ''

    const splitHeader = cellValue.split(' ');
    const quarters: any = { "Q1": "91", "Q2": "92", "Q3": "93", "YE": "99" }

    // Iterate through string array, check if number exists in any of the indexes.
    for (let i = 0; i < splitHeader.length; i++) {
      // if valid year pattern matches, get the beginning year
      if (/^\d{4}-\d{2}$/.test(splitHeader[i])) {
        console.log(splitHeader[i])
        attributeId += splitHeader[i].split('-')[0];

        // remove splitHeader[i] (year that matched regex)
        splitHeader.splice(i, 1)
        console.log(splitHeader);
        break;
      }
    }
    // Check for quarter after year is found to keep order
    let quarterChecker = false;
    for (let i = 0; i < splitHeader.length; i++) {
      if (splitHeader[i] in quarters) {
        attributeId += quarters[splitHeader[i]];
        quarterChecker = true;
        break;
      }
    }
    if (!quarterChecker) attributeId += "99";

    let attributeDefiners = []
    // for things to ignore
    const itemsToIgnore: string[] = ["Q1", "Q2", "Q3", "YE", "Current", "Prior", "Year", "Yr", ""]
    // for things to substitute
    const substitutions: any = {
      "Adj": "Adjustments"
    }

    // filter out year and quarter from attribute
    for (let i = 0; i < splitHeader.length; i++) {

      if (splitHeader[i] in substitutions) {
        splitHeader[i] = substitutions[splitHeader[i]]
      }
      // filter out any other years
      if ((/^\d{4}-\d{2}$/.test(splitHeader[i]) === false && !itemsToIgnore.includes(splitHeader[i]))) {
        attributeDefiners.push(splitHeader[i])
      }
    }

    let attributeIdMatcher = ""
    // form filtered string to match with AttributeIdConfig import
    attributeDefiners.forEach(item => {
      attributeIdMatcher += item + " "
    })
    attributeIdMatcher = attributeIdMatcher.trim()
    attributeIdMatcher = attributeIdMatcher.replace(/ *\([^)]*\) */g, "");
    console.log("ATTRIBUTE HEADER")
    console.log(attributeIdMatcher);

    // check attributeIdConfig database object for a matching keyword for last 3 digits, if not found return an error
    // error allows us to find attributes not in config database
    let inAttributeIdConfigDB = false
    attributeIdMap.forEach(item => {
      if (item.attributeKeyword === attributeIdMatcher) {
        attributeId += item.code
        inAttributeIdConfigDB = true
      }
    })

    if (inAttributeIdConfigDB) {
      return attributeId
    }
    else {
      return "Config Not In DB"
    }
  }

  /** 
   * Function to get attributes and categories from sheet
   * @param currentSheet: excel worksheet that holds sheet data
   * @param attributeIdMap: purely to be passed into makeAttributeId()
   * @param categoryGroupColumn: 
  */
  const getSheetData = async (currentSheet: Worksheet, attributeIdMap: AttributeConfig[], categoryGroupColumn: number, categoryColumn: number,) => {
    // convert PA and SA inputs to integers to use in excel
    const PACol = PA !== '' ? colToInt(PA) : ''
    const SACol = SA !== '' ? colToInt(SA) : ''

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
    // temporary measure is to set it to -1 in the beginning
    let attributeRow: number = -1;
    let attributes: Attribute[] = []
    let unitOfMeasureColumn: number = -1;

    // search for the "Category" title and note down the row; attribute titles will be on that row
    for (let currentRow = 0; currentRow < currentSheet.rowCount; currentRow++) {
      const row = currentSheet.getRow(currentRow)
      const val = row.getCell(categoryColumn).value?.toString() || '';

      if (typeof val === 'string' && val === "Category") {
        attributeRow = currentRow
        break
      }
    }

    let catCheck = true;
    let catGroupCheck = true;

    // if "category" title was not found, return an error message and cancel function
    if (attributeRow === -1) {
      // setErrorMsg("Category index is incorrect");
      generateLog.message.push({ content: `Category Index is incorrect.`, html: "ul class=\"pl-0 mb-2 text-left font-weight-bold\"" })
      generateLog.type = "error"
      catCheck = false;
      console.log("category title not found")
    }

    // search for "Category Group" 
    for (let currentRow = 0; currentRow < currentSheet.rowCount; currentRow++) {
      const row = currentSheet.getRow(currentRow)
      const val = row.getCell(categoryGroupColumn).value?.toString() || '';

      if (typeof val === 'string' && val === "Category Group") {
        attributeRow = currentRow
        break;
      }
    }

    if (attributeRow === -1) {
      // setErrorMsg("Category Group index is incorrect")
      generateLog.message.push({ content: `Category Group index is incorrect.`, html: "ul class=\"pl-0 mb-2 text-left font-weight-bold\"" })
      generateLog.type = "error"
      catGroupCheck = false;
    }

    // if "Category" title was found, get all of the cells with attribute titles in that row
    let invalidAttributes: string[] = []
    if (attributeRow !== -1) {
      const row = currentSheet.getRow(attributeRow)
      for (let currentColumn = categoryColumn + 1; currentColumn <= currentSheet.columnCount; currentColumn++) {
        let rawExcelValue = row.getCell(currentColumn).value
        let cellValue: string = ''

        /*
        the rawExcelValue might be various types
        a formula will be an object like this: {formula: ..., result: ...}
        - formula: the actual formula inputted (Eg: CurrentYear&" YE Actual")
        - result: the resulting value (Eg: 2018-19 YE Actual)
        text will be a string
        numbers might be a string or a number type

        if statement converts an excel formula and numbers to a string and assigns it to cellValue 
        */
        if (rawExcelValue != null && typeof rawExcelValue === 'object') {
          // if cell contains some form of text
          if ("text" in rawExcelValue) {
            cellValue = rawExcelValue["text"]
          }
          // if cell contains a formula, get the formula result (what is displayed)
          else if ("result" in rawExcelValue && rawExcelValue['result'] != undefined) {
            cellValue = rawExcelValue["result"].toString()
          }
          else {
            console.log("unsure of what to do with this: ")
            console.log(rawExcelValue)
          }
        }
        else {
          cellValue = rawExcelValue?.toString() || ''
        }
        console.log(cellValue)

        // add valid attributes to the attributes array
        if (cellValue !== '') {
          const attributesToIgnore: string[] = ['Line #', 'Reference', 'Unit of Measure', 'Notes', 'Comments', 'Definitions', 'Variance', 'OHRS ACCOUNT  NUMBER', 'OHRS ACCOUNT NUMBER']
          let isValid: boolean = true

          // determine unit of measure column
          if (cellValue === 'Unit of Measure') {
            unitOfMeasureColumn = currentColumn
          }

          // filter invalid columns
          attributesToIgnore.forEach((attribute: string) => {
            if (cellValue.includes(attribute)) {
              isValid = false
            }
          })

          if (isValid) {
            // change currentYear and priorYear to reportingPeriod input
            let currentYear = reportingPeriod
            let priorYear = parseInt(attributeHeader) - 1 + "-" + attributeHeader.slice(-2)

            cellValue = cellValue.replace("Current Year", currentYear).replace("Current Yr", currentYear)
            cellValue = cellValue.replace("Prior Year", priorYear).replace("Prior Yr", priorYear)

            if (cellValue.charAt(4) === '/') {
              cellValue = cellValue.substring(0,4) + '-' + cellValue.substring(5);
            }
            console.log(cellValue);

            // get the attributeID of an attribute name
            let attributeId = makeAttributeId(cellValue, attributeIdMap)
            console.log(attributeId)
            // if not in attributeIdMap
            if (attributeId === "Config Not In DB") {
              invalidAttributes.push(cellValue)
            }
            else {
              attributes.push({
                name: cellValue,
                id: attributeId,
                updatedAt: new Date().toString()
              })
            }
          }
        }
      }
    }

    // if there are invalidAttributes (attributes with no config ID, add to output message)
    if (invalidAttributes.length > 0) {
      generateLog.message.push({ content: "Invalid Attributes", html: "h5 class=\"pl-0\"" })
      generateLog.message.push({ content: `Found ${invalidAttributes.length} attributes with no config ID`, html: "ul class=\"pl-0 mb-2 text-left font-weight-bold\"" })
      invalidAttributes.forEach(attribute => generateLog.message.push({ content: attribute, html: "li class=\"pl-0 text-left\"" }))
      generateLog.type = "error"
    }
    returnSheetData['attributes'] = attributes
    const categoryIds: CatIDType = {};
    // if categorygroup and category exists -> go through the statement below
    if (catCheck && catGroupCheck) {
      
      let categoriesWithNoGroup: string[] = []
      // loop through each row and get valid categories (has ID, has category group)
      currentSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0) {
          return;
        }

        let id: number | undefined = undefined
        // ID might be a number or text, if statement gets ID from row and tries to convert to number
        if (row.getCell(colToInt('A')).value) {
          let tempVal = row.getCell(colToInt('A')).value
          if (typeof tempVal === 'string') {
            id = parseInt(tempVal)
          }
          else if (typeof tempVal === 'number') {
            id = tempVal
          }
          else {
            console.log('don\'t know what to do with this ID')
            console.log(tempVal)
          }
        }

        // get category group name using categoryGroup input
        let groupName: string | undefined = row.getCell(categoryGroupColumn).value?.toString();
        if (typeof groupName === 'string' && groupName.split(' ')[0] === 'Total') {
          groupName = groupName.replace('Total ', '');
          groupName = groupName.replace('Total', '');
          if (groupName === "") groupName = undefined;
        }
        // get cell values from category input
        const name: string | undefined = row.getCell(categoryColumn).value?.toString();

        // get unitOfMeasure if unitOfMeasureColumn was found
        let unitOfMeasure: string = ''
        if (unitOfMeasureColumn != -1) {
          unitOfMeasure = row.getCell(unitOfMeasureColumn).value?.toString() || '';
        }
        // get PA and SA value if user inputs the columns
        const PAValue = PA != '' ? (row.getCell(PACol).value?.toString() || '') : '';
        const SAValue = SA != '' ? (row.getCell(SACol).value?.toString() || '') : '';

        // if category has id but no group, don't add to DB and list them in output message so user can add groups
        // else add to categoryTree
        if (id && typeof id === 'number' && name && name.split(' ')[0].toLowerCase() !== 'total') {
          if (!groupName) {
            categoriesWithNoGroup.push(name)
          }
          else {
            if (!categoryIds[groupName]) {
              categoryIds[groupName] = [];
            }
            categoryIds[groupName].push({
              id: id.toString(),
              name,
              unitOfMeasure,
              COA: convertToQuery(PAValue, SAValue),
              updatedAt: new Date().toString()
            });
          }

        }
      });

      //  if there are categoires with no group, add to output message
      if (categoriesWithNoGroup.length > 0) {
        generateLog.type = "error"
        generateLog.message.push({ content: "Categories With No Group", html: "h5 class=\"pl-0\"" })
        generateLog.message.push({ content: `Found ${categoriesWithNoGroup.length} categories with no group, which are not added.`, html: "ul class=\"pl-0 mb-2 text-left font-weight-bold\"" })
        categoriesWithNoGroup.forEach(item => generateLog.message.push({ content: item, html: "li class=\"pl-0 text-left\"" }))
      }
    }
    
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
          Sheet Name:
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
      <br />
      <Typography>{errorMsg}</Typography>
    </div>
  );
}