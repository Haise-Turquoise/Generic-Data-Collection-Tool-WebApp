  
import React, { useMemo, useEffect, useState } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';

import MaterialTable, { Action, Column, Options } from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  calculateOptionsWithTitle, fetchWithStatus
} from '../../../tools/misc';
import AppResourceController from '../../../controllers/AppResource'
import AppResource from '../../../types/appresource';

const AppResourceList = ({ resourceId, isEditable = true, onClickAdd, onClickDelete }: {
  resourceId: { id: string, resourceName: string }[],
  isEditable?: boolean,
  onClickAdd: (e: any, value: AppResource | AppResource[]) => void,
  onClickDelete: (e: any, value: AppResource | AppResource[]) => void,
}) => {
  const [resourceList, setResourceList] = useState<AppResource[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  
  useEffect(() => {
    fetchWithStatus<AppResource>(AppResourceController, setResourceList, setStatus)
  }, [])
  
  // convert resourceId into a id only array
  const resourceIdList: string[] = [];
  resourceId.forEach(resource=>{
    resourceIdList.push(resource.id.toString())
  })

  // table stuff while loading
  const preColumns: Column<AppResource>[] = [{title: 'Name', field: 'resourceName'}]
  const preOrgProgs: AppResource[] = [{
    _id: '',
    id: 0,
    isProtected: '',
    resourceName: status,
    resourcePath: '',
    timestamp: '',
    updatedBy: '',
  }]
  const preNonOrgProgs: AppResource[] = [{
    _id: '',
    id: 0,
    isProtected: '',
    resourceName: status,
    resourcePath: '',
    timestamp: '',
    updatedBy: '',
  }]
  
  const OrgProgs = () => resourceList?.filter(elem => resourceIdList.includes(elem._id));
  const nonOrgProgs = () => resourceList?.filter(elem => !resourceIdList.includes(elem._id));
  const [readOrgRowNum, setOrgRowNum] = useState(1);
  const [readNonOrgRowNum, setNonOrgRowNum] = useState(1);
  // needed to set these here to prevent clearing search term
  useEffect(() => {
    setOrgRowNum(OrgProgs()?.length || 1)
    setNonOrgRowNum(nonOrgProgs()?.length || 1)
  }, [resourceList])

  const columns: Column<AppResource>[] = useMemo(() => 
    [
      { title: 'ResourceName', field: 'resourceName', defaultSort: 'asc' },
      { title: 'ResourcePath', field: 'resourcePath' },
      //   { title: 'TimeStamp', field: 'timestamp' },
      //   { title: 'UpdatedBy', field: 'updatedBy' },
    ],
    [],
  );

  const options: Options<AppResource> = useMemo(() => (
    { 
      actionsColumnIndex: -1, 
      search: false, 
      showTitle: true,
      maxBodyHeight: '400px',
      minBodyHeight: '400px',
    }),
    [],
  );



  const left_actions: Action<AppResource>[] = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Mapping', onClick: onClickDelete }], []);

  const right_actions: Action<AppResource>[] = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Mapping', onClick: onClickAdd }], []);
  // const orgOptions: Options<AppResource> = useMemo(() => calculateOptions(readOrgRowNum), [readOrgRowNum]);
  const orgOptions: any = useMemo(() => calculateOptionsWithTitle(readOrgRowNum), [readOrgRowNum]);
  // const nonOrgOptions: Options<AppResource> = useMemo(() => calculateOptions(readNonOrgRowNum), [readNonOrgRowNum]);
  const nonOrgOptions: any = useMemo(() => calculateOptionsWithTitle(readNonOrgRowNum), [readNonOrgRowNum]);
  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Current Resources"
          // @ts-ignore
          key = {readOrgRowNum}
          columns={!!resourceList ? columns : preColumns}
          data={!!resourceList ? OrgProgs()! : preOrgProgs}
          options={{
            ...orgOptions,
            actionsColumnIndex: 0,
          }}
          actions={(isEditable && !!resourceList) ? left_actions : undefined}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Additional Resources"
          key={readNonOrgRowNum}
          // @ts-ignore
          columns={!!resourceList ? columns : preColumns}
          data={!!resourceList ? nonOrgProgs()! : preNonOrgProgs}
          options={{
            ...nonOrgOptions,
            actionsColumnIndex: 0,
          }}
          actions={(isEditable && !!resourceList) ? right_actions : undefined}
        />
      </div>
    </div>
  );
};

export default AppResourceList;
