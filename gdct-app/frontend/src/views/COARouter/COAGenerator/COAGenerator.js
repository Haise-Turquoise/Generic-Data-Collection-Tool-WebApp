import React, { useState, useEffect } from 'react';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Publish } from '@material-ui/icons';
import ExcelJS from 'exceljs';
import COATreeController from '../../../controllers/COATree';
import SheetNameController from '../../../controllers/sheetName';
import COAGroupController from '../../../controllers/COAGroup';
import COAController from '../../../controllers/COA';

let workbook = new ExcelJS.Workbook();

const ignoreSheets = ['Main Menu', 'Identification'];

const colToInt = col => {
  let res = 0;
  let base = 1;

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

// process uploaded file data
const processData = async (file, cb) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // reads necessary data
  reader.onload = async () => {
    const data = reader.result;
    workbook = await workbook.xlsx.load(data);
    const allData = {};

    workbook.eachSheet((worksheet, sheetId) => {
      if (ignoreSheets.includes(worksheet.name)) {
        return;
      }
      const categoryIds = {};
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0) {
          return;
        }
        const id = row.getCell(constants.ID).value;
        let groupName = row.getCell(constants.GROUP_NAME).value;
        if (typeof groupName === 'string' && groupName.split(' ')[0] === 'Total') {
          groupName = groupName.replace('Total ', '');
        }
        const name = row.getCell(constants.NAME).value;
        const unit = row.getCell(constants.UNIT).value;
        if (id && typeof id === 'number' && groupName && name) {
          if (!categoryIds[groupName]) {
            categoryIds[groupName] = [];
          }
          if (name.split(' ')[0].toLowerCase() !== 'total') {
            categoryIds[groupName].push({ id, name, unit });
          }
        }
      });
      allData[worksheet.name] = categoryIds;
    });
    cb(allData);
  };
};

// build tree objects
const buildObjects = async data => {
  const objects = [];
  const groups = await COAGroupController.fetch();
  const sheets = await SheetNameController.fetch();
  const categories = await COAController.fetch();
  const allNewCategories = [];
  for (const sheetName of Object.keys(data)) {
    // get ID from existing sheetName
    const foundSheet = sheets.find(sheet => sheet.name === 'Medical Staff Remuneration');
    let sheetNameId;
    if (!foundSheet) {
      continue;
    } else {
      sheetNameId = foundSheet._id;
    }
    for (const ctgGroup of Object.keys(data[sheetName])) {
      const newCategories = data[sheetName][ctgGroup];
      // add new categories to a list that will be added to DB later
      newCategories.forEach(category => {
        const inAllCat = allNewCategories.find(cat => cat.id.toString() === category.id.toString());
        const inDBCat = categories.find(cat => cat.id.toString() === category.id.toString());
        if (!inAllCat && !inDBCat) {
          allNewCategories.push(category);
        }
      });

      // get categoryId
      const categoryId = newCategories.map(obj => obj.id);
      // get categoryGroupId
      let foundGroup = groups.find(group => group.name === ctgGroup);
      if (!foundGroup) {
        foundGroup = await COAGroupController.create({
          name: ctgGroup,
          isActive: true,
          updatedBy: localStorage.getItem('currentUser'),
        });
      }
      const categoryGroupId = foundGroup._id;
      objects.push({
        categoryId,
        sheetNameId,
        categoryGroupId,
        updatedBy: localStorage.getItem('currentUser'),
      });
    }
  }
  if (allNewCategories.length > 0) {
    await COAController.create(allNewCategories);
  }
  return objects;
};

// send tree objects to database - check for duplicates
const createTrees = async trees => {
  const currTrees = await COATreeController.fetch();
  // remove existing trees
  trees = trees.filter(tree => {
    const found = currTrees.find(
      currTree =>
        currTree.categoryGroupId &&
        currTree.categoryGroupId._id === tree.categoryGroupId &&
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

export default function COAGenerator() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState('');

  const classes = useStyles();

  const handleFileUpload = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const processWorkbook = () => {
    if (!file) {
      return;
    }
    processData(file, data => buildObjects(data).then(createTrees));
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
