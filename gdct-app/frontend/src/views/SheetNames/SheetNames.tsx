import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';
import Swal, { SweetAlertResult } from 'sweetalert2';
import DetectEmptySheet from './DetectEmptySheet';
import {
  calculateOptions,
  checkDuplicateSet,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus,
} from '../../tools/misc';
import sheetNameController from '../../controllers/sheetName';
//@ts-ignore
import templateTypeController from '../../controllers/templateType';
//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
import SheetName from '../../types/sheetname';

interface SheetNameMT extends SheetName {
  tableData?: any;
}

const SheetNameHeader = () => {
  return (
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Sheet Name</Typography>
    </div>
  );
};

const SheetNamesTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [sheetNames, setSheetNames] = useState<SheetName[] | undefined>(undefined)
  const [idToName, setIdToName] = useState<{[key: string]: string, [key: number]: string} | undefined>();

  // useEffect(() => {
  //   sheetNameController.fetch().then((res: Array<SheetName>) => {
  //     const promise = res!.map(async element => {
  //       const type = await templateTypeController.fetchById(element.templateTypeId)
  //       .catch(err => console.log(err));
  //       const newElement = {
  //         ...element,
  //         templateTypeId: type?.name
  //       };

  //       return newElement;
  //     })
  //     Promise.all(promise).then(result => setSheetNames(result as SheetName[]));
  //   })

  // }, [])

  useEffect(() => {
    const status:any = {};

    async function fetchTemplate() {
      let response = await templateTypeController.fetch()
      response.sort((a:any,b:any) => {
        let fa = a.name,
        fb = b.name;

      if (fa < fb) {
          return -1;
      }
      if (fa > fb) {
          return 1;
      }
      return 0;
      })

      const status:any = {}
      response!.map((template:any) => status[template._id] = template.name)
      console.log(status)
      setIdToName(status)

      sheetNameController.fetch().then((res: unknown) => {
        setSheetNames(res as SheetName[])
      })
    }

    fetchTemplate();
  }, [])


  // table vars while loading data
  const preColumns: Column<SheetNameMT>[] = [{ title: 'Name', field: 'name' }];
  const preSheets: SheetName[] = [
    {
      name: status,
      _id: '',
      id: 0,
      isActive: true,
      updatedAt: '',
      updatedBy: '',
      templateTypeId: '',
    },
  ];

  // Convert Date format
  sheetNames?.forEach((sheetName: SheetName) => {
    sheetName.updatedAt = formatTimestamp(sheetName.updatedAt);
  });

  // Prepare the columns for material table
  const columns: Column<SheetNameMT>[] = useMemo(
    () => [
      {
        title: 'ID',
        field: 'id',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Name',
        field: 'name',
        validate: rowData => checkDuplicateSet(rowData, sheetNames),
      },
      { title: 'Template Type',
        field: 'templateTypeId',
        lookup: idToName,
        validate: rowData => checkDuplicateSet(rowData, sheetNames)
      },
      { title: 'Active', field: 'isActive', type: 'boolean' },
      {
        title: 'Modified On',
        field: 'updatedAt',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [sheetNames],
  );

  const options: Options<SheetNameMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record who and when of the action
  const recordUpdate = (sheetName: SheetNameMT) => {
    //get username and record in Modified By column
    sheetName.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    sheetName.updatedAt = new Date().toLocaleString();
  };

  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (sheetName: SheetNameMT) =>
        new Promise<SheetName | undefined>((resolve, reject) => {
          sheetName.id = readRowNum
          recordUpdate(sheetName);
          controllerAddRow(sheetNameController, setSheetNames, sheetName)
            .then((res?: SheetName) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newSheetName => {
          // For Auditlog
          if (newSheetName) {
            CreateAuditLog(
              null,
              "Create Sheet Name",
              "SheetName",
              newSheetName._id,
              {},
              newSheetName,
            );
          }
        }),
      onRowUpdate: (sheetName: SheetNameMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldSheetName = await sheetNameController.fetchById(sheetName._id);
            CreateAuditLog(
              null,
              'Update Sheet Name',
              'SheetName',
              oldSheetName?._id,
              oldSheetName,
              sheetName,
            );
          })();
          // Do Update
          controllerEditRow(sheetNameController, setSheetNames, sheetName)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
      onRowDelete: (sheetName: SheetNameMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(sheetName);
          //Prevent deletion of referenced sheetname logic
          DetectEmptySheet(sheetName._id).then((hiddenValue: boolean) => {
            //if hiddenValue is true, the categoryTree is empty and the sheetname will be delete-able
            if (hiddenValue === true) {
              controllerDeleteRow(sheetNameController, setSheetNames, sheetName._id)
                .then((res: boolean) => {
                  if (res) {
                    resolve(res)
                  }
                  reject()
                })
              // For Auditlog
              const sheetName_trim = (({ tableData, ...o }) => o)(sheetName);
              CreateAuditLog(null, 'Delete Sheet', 'SheetName', sheetName._id, sheetName_trim, {});
            }
            //trigger warning popup to alert user sheetname is referenced in a Category Tree
            else {
              Swal.fire({
                title: 'Warning!',
                text:
                  'The sheet you are attempting to delete is referenced by a Category Tree and may not be deleted. Please click OK to return to the page.',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then((result:SweetAlertResult<any>) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            }
          });
        }),
    }),
    [readRowNum],
  );

  useEffect(()=>{
    setRowNum(sheetNames?.length || 1)
  }, [sheetNames])
  sheetNames?.sort((a,b)=>a.templateTypeId.localeCompare(b.templateTypeId)); //Sort by name, then sort by template type ID, not ideal it seems
  sheetNames?.sort((a,b)=>a.name.localeCompare(b.name)); //Sort by name, Linda wanted to sort by templateTypeId as well
  return (
    <MaterialTable
      key={readRowNum}
      columns={!!sheetNames ? columns : preColumns}
      data={!!sheetNames ? sheetNames : preSheets}
      editable={!!sheetNames ? editable : undefined}
      options={options}
    />
  );
};

// any type since props unused
const SheetName = (props: any) => (
  <div className="sheetNames">
    <SheetNameHeader />
    <SheetNamesTable {...props} />
  </div>
);

export default SheetName;
