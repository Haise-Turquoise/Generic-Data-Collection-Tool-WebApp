  
import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column, Options } from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  calculateOptions,
} from '../../../tools/misc';
import RoleSubmissionButtonController from '../../../controllers/RoleSubmissionButton'
import statusController from '../../../controllers/status';

type nameObj = { name: string }

const AppButtonList = ({ role, isEditable = true, onClickAdd, onClickDelete }: {
  role: string,
  isEditable?: boolean,
  onClickAdd: (e: any, value: nameObj | nameObj[]) => void,
  onClickDelete: (e: any, value: nameObj | nameObj[]) => void,
}) => {
  const [buttonList, setButtonList] = useState<nameObj[] | undefined>(undefined)
  const [statuses, setStatuses] = useState<nameObj[] | undefined>(undefined)

  const addButton = (_e: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    onClickAdd(_e, rowData)
    setStatuses(prev => {
      return prev?.filter(({name}) => name !== rowData.name)
    })
    setButtonList(prev => {
      return prev?.concat(rowData)
    })
  }

  const deleteButton = (_e: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData)) {
      return
    }
    onClickDelete(_e, rowData)
    setButtonList(prev => {
      return prev?.filter(({name}) => name !== rowData.name)
    })
    setStatuses(prev => {
      return prev?.concat(rowData)
    })
  }
  
  useEffect(() => {
    (async () => {
      const buttonRes = await RoleSubmissionButtonController.fetchSubmissionButtonByRole(role.replace("_", " "))
      const formatted = buttonRes.button?.map(name => ({ name }))
      setButtonList(formatted)
      const statusRes = await statusController.fetch()
      const statusFormatted = statusRes
        .filter(status => !status.forPackage && !formatted.find(({name}) => name === status.name))
        .map(status => ({ name: status.name }))
      setStatuses(statusFormatted)
    })()
  }, [])

  // table stuff while loading
  const preColumns: Column<{name: string}>[] = [{title: 'Name', field: 'name'}]
  const preButtons: nameObj[] = [{
    name: ''
  }]
  const preNonButtons: nameObj[] = [{
    name: ''
  }]

  const [readButtonsNum, setButtonsNum] = useState(1);
  const [readNonButtonsNum, setNonButtonsNum] = useState(1);
  // needed to set these here to prevent clearing search term
  useEffect(() => {
    setButtonsNum(buttonList?.length || 1)
    setNonButtonsNum(statuses?.length || 1)
  }, [buttonList, statuses])

  const columns: Column<nameObj>[] = useMemo(() => 
    [
      { title: 'Button Name', field: 'name', defaultSort: 'asc' },
    ],
    [],
  );

  const options: Options<nameObj> = useMemo(() => (
    { 
      actionsColumnIndex: -1, 
      search: false, 
      showTitle: true,
      maxBodyHeight: '400px',
      minBodyHeight: '400px',
    }),
    [],
  );


  const left_actions: Action<nameObj>[] = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Mapping', onClick: deleteButton }], []);

  const right_actions: Action<nameObj>[] = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Mapping', onClick: addButton }], []);
  // const orgOptions: Options<AppResource> = useMemo(() => calculateOptions(readOrgRowNum), [readOrgRowNum]);
  const orgOptions: any = useMemo(() => calculateOptions(readButtonsNum), [readButtonsNum]);
  // const nonOrgOptions: Options<AppResource> = useMemo(() => calculateOptions(readNonOrgRowNum), [readNonOrgRowNum]);
  const nonOrgOptions: any = useMemo(() => calculateOptions(readNonButtonsNum), [readNonButtonsNum]);
  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Linked App Resource"
          // @ts-ignore
          key = {readButtonsNum}
          columns={!!buttonList ? columns : preColumns}
          data={!!buttonList ? buttonList : preButtons}
          options={{
            ...orgOptions,
            actionsColumnIndex: 0,
          }}
          actions={(isEditable && !!buttonList) ? left_actions : undefined}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Other App Resource"
          key={readNonButtonsNum}
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

export default AppButtonList;
