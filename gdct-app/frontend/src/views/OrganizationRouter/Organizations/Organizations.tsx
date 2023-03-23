import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Action } from 'material-table';
import { Paper, Button, Typography } from '@material-ui/core';

import { RouterProps, useHistory } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import { calculateOptions, fetchWithStatus } from '../../../tools/misc';
import OrgController from '../../../controllers/organization'
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
    <div className="d-flex justify-content-between p-2 mb-3">
      <Typography variant="h5">Organization</Typography>
      <HeaderActions />
    </div>
  );
};

const Organizations = ({ history }: RouterProps) => {
  const [readRowNum, setRowNum] = useState(1);
  const [Orgs, setOrgs] = useState<Organization[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<Organization>(OrgController, setOrgs, setStatus)
  }, [])
  
  // table stuff while loading
  const preOrgs: Organization[] = [
    {
      name: status,
      _id: '',
      id: 0,
      effectiveDate: '',
      IFISNum: '',
      organizationGroupId: [''],
      programId: [''],
      authorizedPerson:{name:'', email:''},
      modifiedPerson:{name:'', modifiedDate: ''},
    },
  ];
  const preColumns: Column<Organization>[] = [{ title: 'Name', field: 'name' }];

  // Prepare the columns for material table
  const columns: Column<Organization>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Legal Name', field: 'legalName' },
      { title: 'Organization ID', field: 'id' },
      { title: 'IFIS Number', field: 'IFISNum' },
      { title: 'Active', type: 'boolean', field: 'active' },
      { title: 'Modified On', field: 'modifiedPerson.modifiedDate' },
      { title: 'Updated By', field: 'modifiedPerson.name',editComponent: (props: any) => {
        return <div></div>;
      }, },
    ],
    [],
  );

  const options = useMemo(() => ({...calculateOptions(readRowNum), filtering: true}), [readRowNum]);

  // Prepare the actions for material table
  const actions: Action<Organization>[] = useMemo(
    () => [
      {
        icon: EditIcon,
        tooltip: 'Edit Organization',
        onClick: (_: any, org: Organization | Organization[]) => {
          if (!Array.isArray(org)) {
            // previously only this behaviour is specified - ill keep that
            history.push(`/admin/organization/edit/${org._id}`);
          }
        },
      },
    ],
    [history],
  );

  useEffect(() => { 
    setRowNum(Orgs?.length || 1)
  }, [Orgs])
  
  return (
    <div className="organizations">
      <OrganizationHeader />
      <MaterialTable
        key={readRowNum}
        columns={!!Orgs ? columns : preColumns}
        data={!!Orgs ? Orgs : preOrgs}
        actions={!!Orgs ? actions : undefined}
        options={options}
      />
    </div>
  );
};

export default Organizations;
