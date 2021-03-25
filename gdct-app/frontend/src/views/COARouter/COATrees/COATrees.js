import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import COATreeController from '../../../controllers/COATree';
import sheetNameController from '../../../controllers/sheetName';
import {
  getSheetNamesRequest,
  createSheetNameRequest,
  deleteSheetNameRequest,
  updateSheetNameRequest,
} from '../../../store/thunks/sheetName';
import {
  getDetectEmptyTree,
  deleteCOATreeBySheetName,
} from '../../../store/thunks/DetectEmptyTree';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectSheetNamesStore } from '../../../store/SheetNamesStore/selectors';
import { selectDetectEmptyTreeStore } from '../../../store/DetectEmptyTreeStore/selectors';
import { ROUTE_CATEGORY_TREES } from '../../../constants/routes';

import { calculateOptions } from '../../../tools/misc'
import DetectEmptyTreeStore from '../../../store/DetectEmptyTreeStore/store';
import moment from 'moment';


// import './COATrees.scss'

const COATreesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Category Tree Management</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COATreesTable = ({ history }) => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);

  const[readRowNum, setRowNum] = useState(1);
  const { sheetNames } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );

  const { detectEmptyTree } = useSelector(
    state => ({
      detectEmptyTree: selectFactoryRESTResponseTableValues(selectDetectEmptyTreeStore)(state),
    }),
    shallowEqual,
  );

  // Convert Date format
  console.log(detectEmptyTree);
  detectEmptyTree.forEach(detectEmptyTree => {
    const logtime = new Date(detectEmptyTree.timestamp);
    detectEmptyTree.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const columns = useMemo(
    () => [
      { title: 'Sheet Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ], 
    []
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  useEffect(()=>{setRowNum(sheetNames.length)},[sheetNames]);

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: "View Sheet's Tree",
        onClick: (_event, sheetName) => history.push(`${ROUTE_CATEGORY_TREES}/${sheetName._id}`),
      },
    ],
    [history],
  );

  const editable = useMemo(
    () => ({
      isDeleteHidden: sheetName => {
        if (sheetName.value.length == 0) {
          return true;
        }

        return false;
      },

      onRowDelete: sheetName =>
        new Promise((resolve, reject) => {
          sheetName.updatedBy=localStorage.getItem('currentUser')
          const event = new Date();
          sheetName.timestamp = event.toLocaleString(); 
          dispatch(deleteCOATreeBySheetName(sheetName, resolve, reject));
          setRefresh(true);
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    // console.log('Page refresh');
    dispatch(getSheetNamesRequest());
    dispatch(getDetectEmptyTree());
  }, [dispatch, refresh]);

  return (
    <MaterialTable
      key={readRowNum}
      columns={columns}
      actions={actions}
      data={detectEmptyTree}
      // @ts-ignore
      options={options}
      editable={editable}
    />
  );
};

const COATrees = props => (
  <div className="COATrees">
    <COATreesHeader />
    {/* <FileDropzone/> */}
    <COATreesTable {...props} />
  </div>
);

export default COATrees;
