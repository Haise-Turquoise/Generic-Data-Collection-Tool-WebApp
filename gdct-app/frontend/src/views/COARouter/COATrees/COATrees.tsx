import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Action, Column, Options } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import COATreeController from '../../../controllers/COATree';
import SheetNameController from '../../../controllers/sheetName'
import { ROUTE_CATEGORY_TREES } from '../../../constants/routes';
import { calculateOptions, formatTimestamp } from '../../../tools/misc'
import CreateAuditLog from '../../AuditLog_Global';
import CategoryTree from '../../../types/categorytree';
import SheetName from '../../../types/sheetname';
import DetectEmptyTree from '../../../types/detectemptytree'
import { RouterProps } from 'react-router';

const buildDET = async (sheetNames: SheetName[]) => {
  const DETs: DetectEmptyTree[] = []
  const allTrees: CategoryTree[] = await COATreeController.fetchBySheetNames(sheetNames)
  console.log("PRINTING SHEET NAMES")
  console.log(sheetNames)
  console.log("PRINTING ALL TREES")
  console.log(allTrees);
  for (let sheetName of sheetNames) {
    const treeContent = allTrees.filter(tree => tree.sheetNameId === sheetName._id)
    console.log("PRINTING TREE CONTENT");
    console.log(treeContent);
    if (treeContent.length !== 0) {
      console.log(treeContent[0].categoryGroupId);
      console.log("Printing Sheet Name Content");
      console.log(sheetName);
    }

    DETs.push({
      _id: sheetName._id,
      name: sheetName.name,
      // treeContent is an array that may be empty
      updatedAt: treeContent.length > 0 ? sheetName.updatedAt: '',   
      updatedBy: treeContent.length > 0 ? sheetName.updatedBy : 'N/A',
      value: treeContent 
    })
  }
  return DETs
}

const COATreesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Tree Management</Typography>
    </Paper>
  );
};

const COATreesTable = ({ history }: RouterProps) => {
  const [refresh, setRefresh] = useState(false);
  const [sheetNames, setSheetNames] =
    useState<SheetName[] | undefined>(undefined)
  const [detectEmptyTree, setDetectEmptyTree] =
    useState<DetectEmptyTree[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

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
        COATreeController.delete(treeElement._id || '');
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
        if (res) {
          setSheetNames(res as SheetName[])
          return buildDET(res as SheetName[])
        } else {
          setStatus('NOT ALLOWED')
          return undefined
        }
      })
      .then((detectEmptyTrees?: DetectEmptyTree[]) => {
        if (detectEmptyTrees) {
          setDetectEmptyTree(detectEmptyTrees)
        }
      })
  }, [])

  // table stuff while loading
  const preColumns: Column<DetectEmptyTree>[] = [{title: 'Name', field: 'name'}]
  const preTrees: DetectEmptyTree[] = [{
    name: status,
    _id: '',
    updatedAt: '',
    updatedBy: '',
    value: [],
  }]

  const[readRowNum, setRowNum] = useState(1);

  // Convert Date format
  detectEmptyTree?.forEach((detectEmptyTree: DetectEmptyTree) => {
    detectEmptyTree.updatedAt = formatTimestamp(detectEmptyTree.updatedAt || '');
  });

  const columns: Column<DetectEmptyTree>[] = useMemo(
    () => [
      { title: 'Sheet Name', field: 'name' },
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
            history.push(`${ROUTE_CATEGORY_TREES}/${sheetName._id}`, {sheetName: sheetName.name})
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
          sheetName.updatedAt = new Date().toLocaleString(); 
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
