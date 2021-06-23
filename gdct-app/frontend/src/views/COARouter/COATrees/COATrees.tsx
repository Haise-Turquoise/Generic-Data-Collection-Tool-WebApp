import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
//@ts-ignore
import COATreeController from '../../../controllers/COATree';
import {
  getSheetNamesRequest,
//@ts-ignore
} from '../../../store/thunks/sheetName';
import {
  getDetectEmptyTree,
  deleteCOATreeBySheetName,
//@ts-ignore
} from '../../../store/thunks/DetectEmptyTree';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectSheetNamesStore } from '../../../store/SheetNamesStore/selectors';
//@ts-ignore
import { selectDetectEmptyTreeStore } from '../../../store/DetectEmptyTreeStore/selectors';
//@ts-ignore
import { ROUTE_CATEGORY_TREES } from '../../../constants/routes';

//@ts-ignore
import { calculateOptions } from '../../../tools/misc'
import moment from 'moment';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';

import CategoryTree from '../../../types/categorytree';
import SheetName from '../../../types/sheetname';
interface SheetNameMT extends SheetName {
  value?: CategoryTree[]
}

import { RouterProps } from 'react-router';


const COATreesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Tree Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COATreesTable = ({ history }: RouterProps) => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const [hasTrees, setHasTrees] = useState(false);

  // table stuff while loading
  const preColumns: Column<SheetNameMT>[] = [{title: 'Name', field: 'name'}]
  const preTrees: SheetNameMT[] = [{
    name: 'LOADING...',
    _id: '',
    id: 0,
    isActive: true,
    templateTypeId: '',
    timestamp: '',
    updatedBy: '',
  }]

  const[readRowNum, setRowNum] = useState(1);
  const { sheetNames }: { sheetNames: SheetName[] } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );

  const { detectEmptyTree }: { detectEmptyTree: SheetNameMT[] } = useSelector(
    state => ({
      detectEmptyTree: selectFactoryRESTResponseTableValues(selectDetectEmptyTreeStore)(state),
    }),
    shallowEqual,
  );

  // Convert Date format
  // console.log(detectEmptyTree);
  detectEmptyTree.forEach((detectEmptyTree: SheetNameMT) => {
    const logtime = new Date(detectEmptyTree.timestamp);
    detectEmptyTree.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  const columns: Column<SheetNameMT>[] = useMemo(
    () => [
      { title: 'Sheet Name', field: 'name' },
      {
        title: 'Modified On',
        field: 'timestamp',
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
    [],
  );

  const options: Options<SheetNameMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  useEffect(() => {
    setRowNum(sheetNames.length);
  }, [sheetNames]);

  const actions: Action<SheetNameMT>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: "View Sheet's Tree",
        onClick: (_: any, sheetName: SheetNameMT | SheetNameMT[]) => {
          if (!Array.isArray(sheetName)) {
            history.push(`${ROUTE_CATEGORY_TREES}/${sheetName._id}`)
          }
        },
      },
    ],
    [history],
  );

  const editable = useMemo(
    () => ({
      isDeleteHidden: (sheetName: SheetNameMT) => {
        if (sheetName.value?.length == 0) {
          return true;
        }
        return false;
      },

      onRowDelete: (sheetName: SheetNameMT) =>
        new Promise((resolve, reject) => {
          console.log(sheetName)
          sheetName.updatedBy=localStorage.getItem('currentUser') || '';
          sheetName.timestamp = new Date().toLocaleString(); 
          dispatch(deleteCOATreeBySheetName(sheetName, resolve, reject));
          setRefresh(true);
        }).then(() => {
          (async () => {
            const oldSheetName = await COATreeController.fetchBySheetName(sheetName._id);
            if (oldSheetName.length === 0) {
              CreateAuditLog(null, 'Delete COA Tree', 'CategoryTree', sheetName._id, sheetName, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    // console.log('Page refresh');
    dispatch(getSheetNamesRequest());
    dispatch(getDetectEmptyTree());
  }, [dispatch, refresh]);

  useEffect(() => {
    if (!hasTrees) {
      setHasTrees(detectEmptyTree.length >= 1);
    }
  }, [detectEmptyTree]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={hasTrees ? columns : preColumns}
      actions={hasTrees ? actions : undefined}
      data={hasTrees ? detectEmptyTree : preTrees}
      // @ts-ignore
      options={options}
      editable={hasTrees ? editable : undefined}
    />
  );
};

const COATrees = (props: RouterProps) => (
  <div className="COATrees">
    <COATreesHeader />
    {/* <FileDropzone/> */}
    <COATreesTable {...props} />
  </div>
);

export default COATrees;
