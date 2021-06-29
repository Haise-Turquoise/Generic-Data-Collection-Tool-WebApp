import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MaterialTable, { Action, Column } from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
//@ts-ignore
import { selectProgramsStore } from '../../../store/ProgramsStore/selectors';
//@ts-ignore
import { getProgramsRequest } from '../../../store/thunks/program';
//@ts-ignore
import ProgController from '../../../controllers/Program'
import Program from '../../../types/program'

interface ProgListProps {
  programIds: string[],
  isEditable?: boolean,
  onClickAdd: (event: Event, program: Program | Program[]) => void,
  onClickDelete: (event: Event, program: Program | Program[]) => void,
}

const ProgList = ({ programIds, onClickAdd, onClickDelete, isEditable = true }: ProgListProps) => {
  const [programList, setProgramList] = useState<Program[] | undefined>(undefined)

  useEffect(() => {
    ProgController.fetch().then((res: unknown) => {
      setProgramList(res as Program[])
    })
  }, [])

  const preColumns: Column<Program>[] = [{
    title: 'Name',
    field: 'name'
  }]
  const preProgs: Program[] = [{
    _id: '',
    code: '',
    isActive: false,
    name: 'LOADING...',
    timestamp: '',
    updatedAt: '',
    updatedBy: '',
  }]

  const OrgProgs = () => programList?.filter((elem: Program) => programIds?.includes(elem._id));
  const nonOrgProgs = () => programList?.filter((elem: Program) => !programIds?.includes(elem._id));

  const columns: Column<Program>[] = useMemo(() => 
    [
      { title: 'Name', field: 'name' },
      { title: 'Code', field: 'code' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    []
  );

  const options = useMemo(() => (
    { 
      actionsColumnIndex: -1, 
      search: false, 
      showTitle: true,
      maxBodyHeight: "400px",
      minBodyHeight: "400px"
    }),
    []
  );

  const left_actions: Action<Program>[] = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Organization', onClick: onClickDelete }], []);

  const right_actions: Action<Program>[] = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Organization', onClick: onClickAdd }], []);

  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Linked Programs"
          // @ts-ignore
          columns={!!programList ? columns : preColumns}
          data={!!programList ? OrgProgs()! : preProgs}
          options={options}
          actions={(isEditable && !!programList) ? left_actions : undefined}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Available Programs"
          // @ts-ignore
          columns={!!programList ? columns : preColumns}
          data={!!programList ? nonOrgProgs()! : preProgs}
          options={options}
          actions={(isEditable && !!programList) ? right_actions : undefined}
        />
      </div>
    </div>
  );
};

export default ProgList;
