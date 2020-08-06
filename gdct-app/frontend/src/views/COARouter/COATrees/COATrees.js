import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import { getSheetNamesRequest } from '../../../store/thunks/sheetName';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectSheetNamesStore } from '../../../store/SheetNamesStore/selectors';
import { ROUTE_CATEGORY_TREES } from '../../../constants/routes';

// import './COATrees.scss'

const COATreesHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">COA Trees</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const COATreesTable = ({ history }) => {
  const dispatch = useDispatch();

  const { sheetNames } = useSelector(
    state => ({
      sheetNames: selectFactoryRESTResponseTableValues(selectSheetNamesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(() => [{ title: 'Sheet Name', field: 'name' }], []);

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

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  useEffect(() => {
    dispatch(getSheetNamesRequest());
  }, [dispatch]);

  return <MaterialTable columns={columns} actions={actions} data={sheetNames} options={options} />;
};

const COATrees = props => (
  <div className="COATrees">
    <COATreesHeader />
    {/* <FileDropzone/> */}
    <COATreesTable {...props} />
  </div>
);

export default COATrees;
