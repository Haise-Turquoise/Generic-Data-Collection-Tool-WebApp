import React, { useMemo, useEffect, useState } from 'react';
import moment from 'moment';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography, Table, TableBody, TableRow, TableHead, TableCell } from '@material-ui/core';
import {
  calculateOptions, controllerAddRow, controllerDeleteRow, controllerEditRow, formatTimestamp,
} from '../../tools/misc'

import ErrorBanner from '../ErrorBanner';
import UnitController from '../../controllers/UnitOfMeasurement';
import UnitOfMeasurement from '../../types/unitofmeasurement';
import UnitOfMeasurementController from '../../controllers/UnitOfMeasurement';
import CreateAuditLog from '../AuditLog_Global';

interface UnitMT extends UnitOfMeasurement {
  tableData?: any
}

const ValidationHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Unit of Measurement Validation Rules</Typography>
    </Paper>
  );
};

const Instruction = () => {
  return (
    <Paper className="header" style={{flexDirection: "column"}}>
      <Typography variant="h5">DataType Instructions</Typography>
      <Typography variant="body1">
        DataType specifies the required length of the input for a given unit of measurement.
        The options are currently int(arg1), decimal(arg1,arg2), date, and text(arg1), where each arg is an optional argument to specify length.
        Any arg can take on the following forms
      </Typography>
      <Typography variant="body1">
        Decimals will always accept integers or any number of decimal points up to the specified amount. For example decimal(1,3) will accept
        9, 9.5, 9.54, 9.543
      </Typography>
      <Table>
        <TableHead>
          <TableCell>Argument</TableCell>
          <TableCell>Meaning</TableCell>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>52</TableCell>
            <TableCell>Length of exactly 52</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>&lt;52</TableCell>
            <TableCell>Less than 52</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>&gt;52</TableCell>
            <TableCell>Greater than 52</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>41-52</TableCell>
            <TableCell>Any number from 41 to 52 inclusive</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  )
}

const ValidationTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [validationRules, setValidationRules] = useState<UnitOfMeasurement[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const statusLookup: {[key: string]: string} = {}

  useEffect(() => {
    UnitController.fetch().then((res: unknown) => {
      if (!res || !Array.isArray(res)) {
        setStatus('NOT ALLOWED')
        return
      }
      setValidationRules(res as UnitOfMeasurement[])
    })
  }, [])

  // table vars for loading
  const preColumns: Column<UnitOfMeasurement>[] = [{ title: 'Name', field: 'dataType', filtering: false }];
  const preUnits: UnitOfMeasurement[] = [
    {
      _id: '',
      createdAt: '',
      dataType: 'Loading...',
      unitOfMeasurement: '',
      updatedAt: '',
      updatedBy: '',
      pattern: ''
    },
  ];

  // Convert Date format
  validationRules?.forEach((unit: UnitOfMeasurement)  => {
    unit.updatedAt = formatTimestamp(unit.updatedAt);
    unit.createdAt = formatTimestamp(unit.createdAt);
  });

  // Prepare the columns for material table
  const columns: Column<UnitOfMeasurement>[] = useMemo(
    () => [
      { title: 'Unit', field: 'unitOfMeasurement' },
      { title: 'Data Type', field: 'dataType' },
      { title: 'Note', field: 'note' },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => (<div></div>) },
      { title: 'Created At', field: 'createdAt', editComponent: () => (<div></div>) },
      { title: 'Updated At', field: 'updatedAt', editComponent: () => (<div></div>) },
    ],
    [],
  );

  /**
   * Generates a RegExp pattern based on the english description provided
   * Must follow rules given on the page
   * @param desc description matching rules below table
   * @returns pattern for a regexp - can use new RegExp(pattern) for example
   */
  function generatePattern(desc: string): string {
    if (desc.startsWith("int")) {
      if (!desc.includes("(")) {
        return "^-?\\d+$"
      } else {
        const arg = parseArg(desc.substring(5, desc.length - 1))
        return `^-?\\d{${arg}}$`
      }
    } else if (desc.startsWith("decimal")) {
      if (!desc.includes("(")) {
        return "^-?\\d+\\.\\d+$"
      }
      const params = desc.substring(8, desc.length - 1).split(",").map(param => parseArg(param))
      if (params.length >= 2 && !params[1]!.includes(",")) {
        params[1] = "1," + params[1]
      }
      return `^-?\\d{${params[0]}}(\\.\\d{${params[1]}})?$`
    } else if (desc.startsWith("date")) {
      return "^[0123]\\d-[01]\\d-\\d{4}$"
    } else if (desc.startsWith("text")) {
      if (!desc.includes("(")) {
        return "^.+$"
      } else {
        const arg = parseArg(desc.substring(6, desc.length - 1))
        return `^.{${arg}}$`
      }
    }
    // no matching case.. something went wrong
    return "^.+$"
  }

  /**
   * Helper function for parsing datatypes and generating patterns
   * @param arg The argument
   * @returns parameter to use in the RegExp pattern string
   */
  function parseArg(arg: string): string | null {
    const num = parseFloat(arg.length > 1 ? arg.substring(1) : arg)
    if (/^\d+$/.test(arg)) { // just a number
      return arg
    } else if (arg[0] === "<") {
      return `1,${num - 1}`
    } else if (arg[0] === ">") {
      return `${num + 1},99999`
    } else if (arg.includes("-")) {
      const [low, high] = arg.split("-")
      return `${low},${high}`
    }
    return arg
  }

  // Record who and when of the action
  function recordUpdate(unit: UnitMT) {
    //get username and record in Modified By column
    unit.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    unit.updatedAt = new Date().toLocaleString();
    unit.pattern = generatePattern(unit.dataType)
  }

  const editable = useMemo(
    () => ({
      onRowAdd: (unit: UnitMT) =>
        new Promise<UnitOfMeasurement | undefined>((resolve, reject) => {
          recordUpdate(unit);
          controllerAddRow(UnitOfMeasurementController, setValidationRules, unit)
            .then((res?: UnitOfMeasurement) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newUnit => {
          // For Auditlog
          if (newUnit) {
            CreateAuditLog(null, "Add Unit Of Measurement", "UnitOfMeasurement", newUnit._id, {}, newUnit);
          }
        }),

      onRowUpdate: (unit: UnitMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(unit);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldUnit = await UnitOfMeasurementController.fetchByUnit(unit.unitOfMeasurement);
            CreateAuditLog(null, 'Update Unit Of Measure', 'Unit Of Measure', oldUnit?._id, oldUnit, unit);
          })();
          // Do Update
          controllerEditRow(UnitOfMeasurementController, setValidationRules, unit)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (unit: UnitMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(unit);
          // For Auditlog
          const unit_trim = (({ tableData, ...o }) => o)(unit);
          CreateAuditLog(null, "Delete Unit Of Measurement", "UnitOfMeasurement", unit._id, unit_trim, {});
          controllerDeleteRow(UnitOfMeasurementController, setValidationRules, unit._id!)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [],
  );

  const options: Options<UnitOfMeasurement> = useMemo(() => ({...calculateOptions(readRowNum), filtering: true}), [readRowNum]);

  useEffect(()=>{
    setRowNum(validationRules?.length || 1)
  }, [validationRules])

  return (
    <div>
      <MaterialTable
        key={readRowNum}
        columns={!!validationRules ? columns : preColumns}
        data={!!validationRules ? validationRules : preUnits}
        editable={!!validationRules ? editable : undefined}
        options={options}
      />
    </div>
  );
};

// any type since no props used in table
const UnitValidation = (props: any) => (
  <div className="programsPage">
    <ValidationHeader />
    <ValidationTable {...props} />
    <br />
    <Instruction />
  </div>
);

export default UnitValidation;
