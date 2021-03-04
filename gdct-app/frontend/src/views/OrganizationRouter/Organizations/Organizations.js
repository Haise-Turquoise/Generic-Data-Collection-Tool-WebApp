import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

import './Organizations.scss';
import { useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';
import { getOrgsRequest, updateOrgsRequest } from '../../../store/thunks/organization';
import { calculateOptions } from '../../../tools/misc'

const HeaderActions = () => {
  const history = useHistory();

  const handleCreateOrg = () => history.push('/admin/organization/create');

  return (
    <div>
      <Button color="primary" variant="contained" size="large" onClick={handleCreateOrg}>
        Create
      </Button>
    </div>
  );
};

const OrganizationHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Organization</Typography>
      <HeaderActions />
    </Paper>
  );
};

const Organizations = ({ history }) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { Orgs } = useSelector(state => ({
    Orgs: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
  }));

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Legal Name', field: 'legalName' },
      { title: 'Organization ID', field: 'id' },
      { title: 'IFIS Number', field: 'IFISNum' },
      { title: 'Active', type: 'boolean', field: 'active' },
            { title: 'Modified On', field: 'timestamp',
      editComponent: props => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', 
      editComponent: props => {return <div></div>} },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const actions = useMemo(
    () => [
      {
        icon: EditIcon,
        tooltip: 'Edit Organization',
        onClick: (_event, org) => history.push(`/admin/organization/edit/${org._id}`),
      },
    ],
    [history],
  );

  //*implement updateby and modified on columns
  // const editable = useMemo(
  //   () => ({
  //     onClick: Orgs =>
  //       new Promise((resolve, reject) => {
  //         Orgs.updatedBy=localStorage.getItem('currentUser')
  //         const event = new Date();
  //         Orgs.timestamp = event.toLocaleString(); 
  //         dispatch(updateOrgsRequest(Orgs, resolve, reject));
  //       }),
  //   }),
  //   [dispatch],
  // );

  useEffect(() => {
    dispatch(getOrgsRequest());
  }, [dispatch]);

  useEffect(() => { setRowNum(Orgs.length) }, [Orgs])

  return (
    <div className="organizations">
      <OrganizationHeader />
      <MaterialTable key={readRowNum} columns={columns} data={Orgs} actions={actions} options={options} />
    </div>
  );
};

Organizations.propTypes = {
  history: PropTypes.object,
};

export default Organizations;
