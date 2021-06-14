  
import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import MaterialTable from 'material-table';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';

import { selectAppResourcesStore } from '../../../store/AppResourcesStore/selectors';
import { getAppResourcesRequest } from '../../../store/thunks/AppResource';
//
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectProgramsStore } from '../../../store/ProgramsStore/selectors';
import { getProgramsRequest } from '../../../store/thunks/program';
import { calculateOptions } from '../../../tools/misc';
const AppResourceList = ({ resourceId, isEditable = true, onClickAdd, onClickDelete }) => {
  const dispatch = useDispatch();
  const [hasProgs, setHasProgs] = useState(false)
  useEffect(() => {
    dispatch(getAppResourcesRequest());
  }, []);
  
  const { resourceList } = useSelector(state => ({
    resourceList: selectFactoryRESTResponseTableValues(selectAppResourcesStore)(state),
  }));
  // convert resourceId into a id only array
  const resourceIdList = [];
  resourceId.forEach(resource=>{
    resourceIdList.push(resource.id)
  })

  // table stuff while loading
  const preOrgProgs = [{ name: 'LOADING...' }]
  const preNonOrgProgs = [{ name: 'LOADING...' }]
  const preColumns = [{title: 'Name', field: 'name'}]
  
  const OrgProgs = () => resourceList.filter(elem => resourceIdList.includes(elem._id));
  const nonOrgProgs = () => resourceList.filter(elem => !resourceIdList.includes(elem._id));
  const [readOrgRowNum, setOrgRowNum] = useState(1);
  const [readNonOrgRowNum, setNonOrgRowNum] = useState(1);
  // needed to set these here to prevent clearing search term
  useEffect(() => {
    setOrgRowNum(OrgProgs().length)
    setNonOrgRowNum(nonOrgProgs().length)
    setHasProgs(resourceList.length >= 1)
  }, [resourceList])

  const columns = useMemo(() => 
    [
      { title: 'ResourceName', field: 'resourceName', defaultSort: 'asc' },
      { title: 'ResourcePath', field: 'resourcePath' },
    //   { title: 'TimeStamp', field: 'timestamp' },
    //   { title: 'UpdatedBy', field: 'updatedBy' },
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


  const left_actions = useMemo(() => [{ icon: DeleteIcon, tooltip: 'Remove from Mapping', onClick: onClickDelete }], []);

  const right_actions = useMemo(() => [{ icon: AddIcon, tooltip: 'Add to Mapping', onClick: onClickAdd }], []);
  const orgOptions = useMemo(() => calculateOptions(readOrgRowNum), [readOrgRowNum]);
  const nonOrgOptions = useMemo(() => calculateOptions(readNonOrgRowNum), [readNonOrgRowNum]);
  return (
    <div className="tableContainer">
      <div className="tableWrapper-linked">
        <MaterialTable
          title="Linked App Resource"
          // @ts-ignore
          key = {readOrgRowNum}
          columns={OrgProgs().length >= 1 ? columns : preColumns}
          data={OrgProgs().length >= 1 ? OrgProgs() : preOrgProgs}
          options={{
            ...orgOptions,
            actionsColumnIndex: 0
          }}
          actions={(isEditable && OrgProgs().length >= 1) ? left_actions : null}
        />
      </div>
      <div className="tableWrapper-other">
        <MaterialTable
          title="Other App Resource"
          key = {readNonOrgRowNum}
          // @ts-ignore
          columns={hasProgs ? columns : preColumns}
          data={hasProgs ? nonOrgProgs() : preNonOrgProgs}
          options={{
            ...nonOrgOptions,
            actionsColumnIndex: 0
          }}
          actions={(isEditable && hasProgs) ? right_actions : null}
        />
      </div>
    </div>
  );
};

AppResourceList.propTypes = {
  resourceId: PropTypes.array.isRequired,
  isEditable: PropTypes.bool,
  onClickAdd: PropTypes.func.isRequired,
  onClickDelete: PropTypes.func.isRequired,
};

export default AppResourceList;