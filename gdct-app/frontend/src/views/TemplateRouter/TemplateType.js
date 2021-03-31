import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
import Loading from '../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
  getTemplateTypesRequest,
  updateTemplateTypeRequest,
} from '../../store/thunks/templateType';

import ProgramList from '../OrganizationRouter/ProgramList';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
import TemplateTypesStore from '../../store/TemplateTypesStore/store';
import { calculateOptions } from '../../tools/misc';

const TemplateTypeHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Type Viewer</Typography>
      {/* <HeaderActions/> */}
    </Paper>
    
  );
};

// Page Component Part 1
const TemplateTypeTable = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  // Prepare the data for TemplateTypeTable
  const { templateType } = useSelector(
    state => ({
      templateType: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
        elem => elem._id === _id,
      ) || [{}],
    }),
    shallowEqual,
  );

  // Prepare the columns for TemplateTypeTable
  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Description', field: 'description' },
      { title: 'Approvable', type: 'boolean', field: 'isApprovable' },
      { title: 'Reviewable', type: 'boolean', field: 'isReviewable' },
      { title: 'Submittable', type: 'boolean', field: 'isSubmittable' },
      { title: 'Inputtable', type: 'boolean', field: 'isInputtable' },
      { title: 'Viewable', type: 'boolean', field: 'isViewable' },
      { title: 'Reportable', type: 'boolean', field: 'isReportable' },
      { title: 'Active', type: 'boolean', field: 'isActive' },
    ],
    [],
  );

  useEffect(() => { setRowNum(templateType.length) }, [templateType])

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  useEffect(() => {
    dispatch(getTemplateTypesRequest());
    return () => {
      dispatch(TemplateTypesStore.actions.RESET());
    };
  }, [dispatch]);

  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      title="Current Template Type"
      columns={columns}
      data={templateType}
      options={options}
    />
  );
};

// ==================================================================================================
// Page Component Part 2 // from ProgramList from Organization
const LinkProgramTable = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();

  // Prepare the data for LinkProgramTable
  let { templateType } = useSelector(
    state => ({
      templateType: (selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
        elem => elem._id === _id,
      ) || [{}])[0],
    }),
    shallowEqual,
  );

  const reject = () => { alert('Missing or invalid parameters') };

  const onClickAdd = (_event, rowData) => {
    templateType.programIds = templateType.programIds.concat([rowData._id]);
    dispatch(updateTemplateTypeRequest(templateType, null, reject));
    // Refresh templateType because dispatch makes object read-only, not allowing multiple adding.
    templateType = Object.assign({}, templateType);
  };

  const onClickDelete = (_event, rowData) => {
    templateType.programIds = templateType.programIds.filter(elem => elem !== rowData._id);
    dispatch(updateTemplateTypeRequest(templateType, null, reject));
    // Refresh templateType because dispatch makes object read-only, not allowing multiple deleting.
    templateType = Object.assign({}, templateType);
  };
  
  const history = useHistory();
  const redirect = () => { history.push('/admin/template/type') };
  
  return !templateType ? (
    <Loading message={"Loading..."}/>
  ) : (
      <div>
        <ProgramList
          programIds={templateType.programIds}
          onClickAdd={onClickAdd}
          onClickDelete={onClickDelete}
        />
        <Button
          onClick={redirect} 
          variant="contained" 
          color="primary"
          style={{marginTop: '0.8%'}}
        >
          <ArrowBackIcon></ArrowBackIcon>
          Back
        </Button>
      </div>
    );
};


const TemplateType = props => (
  <div className="templateTypePage">
    <TemplateTypeHeader />
    <TemplateTypeTable {...props} />
    <LinkProgramTable {...props} />
  </div>
);

export default TemplateType;
