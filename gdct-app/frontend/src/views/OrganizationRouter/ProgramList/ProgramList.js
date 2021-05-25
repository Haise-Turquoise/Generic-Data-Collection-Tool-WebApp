import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectProgramsStore } from '../../../store/ProgramsStore/selectors';
import { getProgramsRequest } from '../../../store/thunks/program';

const ProgList = ({ programIds, isEditable = true, onClickAdd, onClickDelete }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProgramsRequest());
  }, []);
  
  const { programList } = useSelector(state => ({
    programList: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
  }));

  const OrgProgs = () => programList.filter(elem => programIds.includes(elem._id));
  const nonOrgProgs = () => programList.filter(elem => !programIds.includes(elem._id));

  const columns = useMemo(() => 
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

  const left_actions = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Organization', onClick: onClickDelete }], []);

  const right_actions = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Organization', onClick: onClickAdd }], []);

  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Linked Programs"
          // @ts-ignore
          columns={columns}
          data={OrgProgs()}
          options={options}
          actions={isEditable ? left_actions : null}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Available Programs"
          // @ts-ignore
          columns={columns}
          data={nonOrgProgs()}
          options={options}
          actions={isEditable ? right_actions : null}
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
