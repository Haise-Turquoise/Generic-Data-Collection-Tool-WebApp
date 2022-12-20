import React, { useMemo, useEffect, useState } from 'react';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import {
  calculateOptions,
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  fetchWithStatus,
  checkDuplicates,
  formatTimestamp,
} from '../../tools/misc';
import OrgController from '../../controllers/organization'
import OrganizationGroupController from '../../controllers/organizationGroup'
import OrganizationGroup from '../../types/organizationgroup'
import CreateAuditLog from '../AuditLog_Global';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { selectOrganizationGroupStore } from '../../store/OrganizationGroupStore/selectors';
import ErrorBanner from '../ErrorBanner';
import Organization from '../../types/organization';

interface OrganizationGroupMT extends OrganizationGroup {
  tableData?: any;
}

const OrganizationGroupHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Organization Group</Typography>
      {/* <HeaderActions /> */}
    </Paper>
  );
};

const OrganizationGroupsTable = () => {
  const [readRowNum, setRowNum] = useState(1);
  const [OrgGroups, setOrgGroups] = useState<OrganizationGroup[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  useEffect(() => {
    fetchWithStatus<OrganizationGroup>(OrganizationGroupController, setOrgGroups, setStatus)
  }, [])
  const preColumns: Column<OrganizationGroupMT>[] = [{ title: 'Name', field: 'name' }];
  // table stuff while loading
  const preOrgGroups: OrganizationGroupMT[] = [
    {
      name: status,
      _id: '',
      id: 0,
      isActive: true,
      updatedAt: '',
      updatedBy: '',
      createdBy: '',
    },
  ];
  OrgGroups?.forEach((OrgGroup: OrganizationGroup) => {
    OrgGroup.updatedAt = formatTimestamp(OrgGroup.updatedAt);
  });
  // Prepare the columns for material table
  const columns: Column<OrganizationGroupMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'id', field: 'id' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
      { title: 'Modified On', field: 'updatedAt',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By', field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Created By', field: 'createdBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [OrgGroups],
  );
  const options: Options<OrganizationGroupMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  function recordUpdate(OrgGroup: OrganizationGroupMT) {
    //get username and record in Modified By column
    OrgGroup.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    OrgGroup.updatedAt = new Date().toLocaleString();
  }

  const editable = useMemo(
    () => ({
      onRowAdd: (OrgGroup: OrganizationGroupMT) =>
        new Promise<OrganizationGroup | undefined>((resolve, reject) => {
          recordUpdate(OrgGroup);
          OrgGroup.createdBy = localStorage.getItem('currentUser') || '';
          controllerAddRow(OrganizationGroupController, setOrgGroups, OrgGroup)
            .then((res?: OrganizationGroup) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newOrgGroup => {
          // For Auditlog
          if (newOrgGroup) {
            CreateAuditLog(null, "Create Organization Group", "Organization Group", newOrgGroup._id, {}, newOrgGroup);
          }
        }),

      onRowUpdate: (OrgGroup: OrganizationGroupMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(OrgGroup);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldOrgGroup: OrganizationGroup | null = await OrganizationGroupController.fetchById(OrgGroup._id);
            CreateAuditLog(null, 'Update Organization Group', 'Organization Group', oldOrgGroup?._id, oldOrgGroup, OrgGroup);
          })();
          // Do Update
          controllerEditRow(OrganizationGroupController, setOrgGroups, OrgGroup)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (OrgGroup: OrganizationGroupMT) =>
        new Promise(async (resolve, reject) => {
          recordUpdate(OrgGroup);
          // For Auditlog
          const OrgGroup_trim = (({ tableData, ...o }) => o)(OrgGroup);
          await OrgController.fetchByOrgGroupId(OrgGroup._id).then((orgs: Organization[]) => {
            if (orgs.length > 0) {
              Swal.fire({
                title: 'Warning!',
                text:
                  'This group can not be removed because it is referenced',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then((result: SweetAlertResult<any>) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
              reject();
            } else {
              controllerDeleteRow(OrganizationGroupController, setOrgGroups, OrgGroup._id).then((res: boolean) => {
                resolve(res)
              });
              CreateAuditLog(null, "Delete Organization Group", "Organization Group", OrgGroup._id, OrgGroup_trim, {});
            }
          });
        }),
    }),
    [],
  );

  useEffect(() => {
    setRowNum(OrgGroups?.length || 1)
  }, [OrgGroups]);
  return (
    <MaterialTable
      key={readRowNum}
      columns={!!OrgGroups ? columns : preColumns}
      data={!!OrgGroups ? OrgGroups : preOrgGroups}
      editable={!!OrgGroups ? editable : undefined}
      //actions={!!OrgGroups ? actions : undefined}
      options={options}
    />
  );
};

const OrganizationGroup = (props: any) => (
  <div className="organizationgroupsPage">
    <OrganizationGroupHeader />
    <ErrorBanner
      title={'Cannot delete the selected organization group since it is referenced in the master value table'}
      targetStore={selectOrganizationGroupStore}
    />
    <OrganizationGroupsTable {...props} />
  </div>
);
export default OrganizationGroup;