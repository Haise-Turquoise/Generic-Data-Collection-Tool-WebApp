import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
//@ts-ignore
import COATreeController from '../../../controllers/COATree';
//@ts-ignore
import SheetNameController from '../../../controllers/sheetName'
import {
  getSheetNamesRequest,
//@ts-ignore
} from '../../../store/thunks/sheetName';
import {
  getDetectEmptyTree,
  deleteCOATreeBySheetName
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
import DetectEmptyTree from '../../../types/detectemptytree'

import { RouterProps } from 'react-router';

const buildDET = async (sheetNames: SheetName[]) => {
  const DETs: DetectEmptyTree[] = []
  const allTrees: CategoryTree[] = await COATreeController.fetchBySheetNames(sheetNames)
  for (let sheetName of sheetNames) {
    const treeContent = allTrees.filter(tree => tree.sheetNameId === sheetName._id)
    DETs.push({
      _id: sheetName._id,
      name: sheetName.name,
      // treeContent is an array that may be empty
      timestamp: treeContent.length > 0 ? treeContent[0].timestamp : '',   
      updatedBy: treeContent.length > 0 ? treeContent[0].updatedBy : 'N/A',
      value: treeContent 
    })
  }
  return DETs
}

const COATreesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Tree Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COATreesTable = ({ history }: RouterProps) => {
  const [refresh, setRefresh] = useState(false);
  const [sheetNames, setSheetNames] =
    useState<SheetName[] | undefined>(undefined)
  const [detectEmptyTree, setDetectEmptyTree] =
    useState<DetectEmptyTree[] | undefined>(undefined)

  const deleteCOATreeBySheetName = (sheetNameId: string, resolve: (val: unknown) => void) => {
    // clear appropriate values in state
    setDetectEmptyTree(prev => {
      if (!prev) {
        return prev
      }
      const copy = [...prev]
      copy.forEach(det => {
        if (det._id === sheetNameId) {
          det.value = []
        }
      })
      return copy
    })

    // delete appropriate trees from db
    COATreeController.fetchBySheetName(sheetNameId)
    .then((treeElementList: CategoryTree[]) => {
      treeElementList.forEach(treeElement => {
        COATreeController.delete(treeElement._id);
      });
    })
    .then((result: unknown) => {
      if (resolve) {
        resolve(true);
      }
    });
  }

  useEffect(() => {
    SheetNameController.fetch()
      .then((res: unknown) => {
        setSheetNames(res as SheetName[])
        return buildDET(res as SheetName[])
      })
      .then((detectEmptyTrees: DetectEmptyTree[]) => {
        setDetectEmptyTree(detectEmptyTrees)
      })
  }, [])

  // table stuff while loading
  const preColumns: Column<DetectEmptyTree>[] = [{title: 'Name', field: 'name'}]
  const preTrees: DetectEmptyTree[] = [{
    name: 'LOADING...',
    _id: '',
    timestamp: '',
    updatedBy: '',
    value: [],
  }]

  const[readRowNum, setRowNum] = useState(1);

  // Convert Date format
  detectEmptyTree?.forEach((detectEmptyTree: DetectEmptyTree) => {
    //@ts-ignore
    const logtime = new Date(detectEmptyTree.timestamp);
    detectEmptyTree.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  const columns: Column<DetectEmptyTree>[] = useMemo(
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

  const options: Options<DetectEmptyTree> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  useEffect(()=>{
    setRowNum(sheetNames?.length || 1)
  },[sheetNames]);

  const actions: Action<DetectEmptyTree>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: "View Sheet's Tree",
        onClick: (_: any, sheetName: DetectEmptyTree | DetectEmptyTree[]) => {
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
      isDeleteHidden: (sheetName: DetectEmptyTree) => {
        if (sheetName.value?.length == 0) {
          return true;
        }
        return false;
      },

      onRowDelete: (sheetName: DetectEmptyTree) =>
        new Promise((resolve, reject) => {
          console.log(sheetName)
          sheetName.updatedBy=localStorage.getItem('currentUser') || '';
          sheetName.timestamp = new Date().toLocaleString(); 
          // deleteCOATreeBySheetName(sheetName._id, resolve);
          deleteCOATreeBySheetName(sheetName._id, resolve)
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
    [],
  );

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!detectEmptyTree ? columns : preColumns}
      actions={!!detectEmptyTree ? actions : undefined}
      data={!!detectEmptyTree ? detectEmptyTree : preTrees}
      // @ts-ignore
      options={options}
      editable={!!detectEmptyTree ? editable : undefined}
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
