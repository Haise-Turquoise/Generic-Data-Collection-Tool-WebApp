  
import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column } from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  calculateOptionsWithTitle,
} from '../../../tools/misc';
import roleWorkflowStatusController from '../../../controllers/RoleWorkflowStatus'
import statusController from '../../../controllers/status';

type nameObj = { name: string }

const AppWorkflowList = ({ role, isEditable = true, onClickAdd, onClickDelete }: {
  role: string,
  isEditable?: boolean,
  onClickAdd: (e: any, value: nameObj | nameObj[]) => void,
  onClickDelete: (e: any, value: nameObj | nameObj[]) => void,
}) => {
  const [workflowList, setWorkflowList] = useState<nameObj[] | undefined>(undefined)
  const [statuses, setStatuses] = useState<nameObj[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  const addButton = (_e: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    onClickAdd(_e, rowData)
    setStatuses(prev => {
      return prev?.filter(({name}) => name !== rowData.name)
    })
    setWorkflowList(prev => {
      return prev?.concat(rowData)
    })
  }

  const deleteButton = (_e: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    onClickDelete(_e, rowData)
    setWorkflowList(prev => {
      return prev?.filter(({name}) => name !== rowData.name)
    })
    setStatuses(prev => {
      return prev?.concat(rowData)
    })
  }
  
  useEffect(() => {
    if (role === 'Not Found') {
      return
    }
    (async () => {
      const workflowRes = await roleWorkflowStatusController.fetchStatusByRole(role.replace("_", " "))
      if (!workflowRes) {
        setStatus('NOT ALLOWED')
      }
      const formatted = workflowRes?.workflowStatus?.map(name => ({ name })) || []
      setWorkflowList(formatted)
      const statusRes = await statusController.fetch()
      const statusFormatted = statusRes
        .filter(status => !status.forPackage && formatted && !formatted.find(({name}) => name === status.name))
        .map(status => ({ name: status.name }))
      setStatuses(statusFormatted)
    })()
  }, [role])

  // table stuff while loading
  const preColumns: Column<{name: string}>[] = [{title: 'Name', field: 'name'}]
  const preWorkflows: nameObj[] = [{
    name: status
  }]
  const preNonButtons: nameObj[] = [{
    name: status
  }]

  const [readWorkflowsNum, setWorkflowsNum] = useState(1);
  const [readNonWorkflowsNum, setNonWorkflowsNum] = useState(1);
  // needed to set these here to prevent clearing search term
  useEffect(() => {
    setWorkflowsNum(workflowList?.length || 1)
    setNonWorkflowsNum(statuses?.length || 1)
  }, [workflowList, statuses])

  const columns: Column<nameObj>[] = useMemo(() => 
    [
      { title: 'Status Name', field: 'name', defaultSort: 'asc' },
    ],
    [],
  );

  const left_actions: Action<nameObj>[] = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Mapping', onClick: deleteButton }], []);

  const right_actions: Action<nameObj>[] = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Mapping', onClick: addButton }], []);
  // const orgOptions: Options<AppResource> = useMemo(() => calculateOptions(readOrgRowNum), [readOrgRowNum]);
  const orgOptions: any = useMemo(() => calculateOptionsWithTitle(readWorkflowsNum), [readWorkflowsNum]);
  // const nonOrgOptions: Options<AppResource> = useMemo(() => calculateOptions(readNonOrgRowNum), [readNonOrgRowNum]);
  const nonOrgOptions: any = useMemo(() => calculateOptionsWithTitle(readNonWorkflowsNum), [readNonWorkflowsNum]);
  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Current Workflows"
          // @ts-ignore
          key = {readWorkflowsNum}
          columns={!!workflowList ? columns : preColumns}
          data={!!workflowList ? workflowList : preWorkflows}
          options={{
            ...orgOptions,
            actionsColumnIndex: 0,
          }}
          actions={(isEditable && !!workflowList) ? left_actions : undefined}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Additional Workflows"
          key={readNonWorkflowsNum}
          // @ts-ignore
          columns={!!statuses ? columns : preColumns}
          data={!!statuses ? statuses : preNonButtons}
          options={{
            ...nonOrgOptions,
            actionsColumnIndex: 0,
          }}
          actions={(isEditable && !!statuses) ? right_actions : undefined}
        />
      </div>
    </div>
  );
};

export default AppWorkflowList;
