import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import MaterialTable, { Column, Action } from 'material-table';
import { Paper, Button, Typography }from '@material-ui/core';

import { BrowserRouter, Route, Router, RouterProps, useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';
//@ts-ignore
import { getOrgsRequest } from '../../../store/thunks/organization';
//@ts-ignore
import { calculateOptions } from '../../../tools/misc';
import Organization from '../../../types/organization'

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

const Organizations = ({ history }: RouterProps) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasOrgs, setHasOrgs] = useState(false)
  
  // table stuff while loading
  const preOrgs = [{ name: 'LOADING...' }]
  const preColumns: Column<any>[] = [{title: 'Name', field: 'name'}]

  // Prepare the data for material table
  const { Orgs }: { Orgs: Organization[] } = useSelector(state => ({
    Orgs: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
  }));

  // Prepare the columns for material table
  const columns: Column<any>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Legal Name', field: 'legalName' },
      { title: 'Organization ID', field: 'id' },
      { title: 'IFIS Number', field: 'IFISNum' },
      { title: 'Active', type: 'boolean', field: 'active' },
      { title: 'Modified On', field: 'timesStamp' },
      { title: 'Updated By', field: 'updatedBy' },
    ],
    [],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Prepare the actions for material table
  const actions: Action<any>[] = useMemo(
    () => [
      {
        icon: EditIcon,
        tooltip: 'Edit Organization',
        onClick: (_: any, org: Organization) => history.push(`/admin/organization/edit/${org._id}`),
      },
    ],
    [history],
  );

  useEffect(() => {
    dispatch(getOrgsRequest());
  }, [dispatch]);

  useEffect(() => { 
    setRowNum(Orgs.length)
    if (!hasOrgs) {
      setHasOrgs(Orgs.length >= 1)
    }
  }, [Orgs])
  
  return (
    <div className="organizations">
      <OrganizationHeader />
      <MaterialTable 
        key={readRowNum}
        columns={hasOrgs ? columns : preColumns}
        data={hasOrgs ? Orgs : preOrgs}
        actions={hasOrgs ? actions : undefined}
        options={options}
      />
    </div>
  );
};

Organizations.propTypes = {
  history: PropTypes.object,
};

export default Organizations;
