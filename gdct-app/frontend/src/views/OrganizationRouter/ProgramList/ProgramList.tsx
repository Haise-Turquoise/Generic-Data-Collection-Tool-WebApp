import React, { useMemo, useEffect } from 'react';
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
import Program from '../../../types/program'

interface ProgListProps {
  programIds: string[],
  isEditable: boolean,
  onClickAdd: (event: Event, program: Program) => void,
  onClickDelete: (event: Event, program: Program) => void,
}

const ProgList = ({ programIds, isEditable = true, onClickAdd, onClickDelete }: ProgListProps) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProgramsRequest());
  }, []);
  
  const { programList } = useSelector(state => ({
    programList: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
  }));

  const OrgProgs = () => programList.filter((elem: Program) => programIds.includes(elem._id));
  const nonOrgProgs = () => programList.filter((elem: Program) => !programIds.includes(elem._id));

  const columns: Column<{ title: string, field: string, [key: string]: any }>[] = useMemo(() => 
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

  const left_actions: Action<any>[] = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Organization', onClick: onClickDelete }], []);

  const right_actions: Action<any>[] = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Organization', onClick: onClickAdd }], []);

  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Linked Programs"
          // @ts-ignore
          columns={columns}
          data={OrgProgs()}
          options={options}
          actions={isEditable ? left_actions : undefined}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Available Programs"
          // @ts-ignore
          columns={columns}
          data={nonOrgProgs()}
          options={options}
          actions={isEditable ? right_actions : undefined}
        />
      </div>
    </div>
  );
};

ProgList.propTypes = {
  programIds: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
  onClickAdd: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
};

export default ProgList;
