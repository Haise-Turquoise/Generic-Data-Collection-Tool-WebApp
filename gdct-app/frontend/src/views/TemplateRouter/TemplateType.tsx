import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RouteChildrenProps, RouteComponentProps, RouterProps, useHistory } from 'react-router-dom';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
//@ts-ignore
import Loading from '../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Loading from '../../components/Loading';

import {
  getTemplateTypesRequest,
  updateTemplateTypeRequest,
//@ts-ignore
} from '../../store/thunks/templateType';

//@ts-ignore
import ProgramList from '../OrganizationRouter/ProgramList';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
//@ts-ignore
import TemplateTypesStore from '../../store/TemplateTypesStore/store';
//@ts-ignore
import { calculateOptions } from '../../tools/misc';

import TemplateType from '../../types/templatetype';
import Program from '../../types/program';
type propType = { _id?: string }

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
}: RouteComponentProps<propType>) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  // Prepare the data for TemplateTypeTable
  const { templateType }: { templateType: TemplateType[] } = useSelector(
    state => ({
      templateType: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
        (elem: TemplateType) => elem._id === _id,
      ) || [{}],
    }),
    shallowEqual,
  );

  // Prepare the columns for TemplateTypeTable
  const columns: Column<TemplateType>[] = useMemo(
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

  useEffect(() => {
    setRowNum(templateType.length);
  }, [templateType]);

  const options: Options<TemplateType> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

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
}: RouteComponentProps<propType>) => {
  const dispatch = useDispatch();

  // Prepare the data for LinkProgramTable
  let { templateType }: { templateType: TemplateType } = useSelector(
    state => ({
      templateType: (selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state).filter(
        (elem: TemplateType) => elem._id === _id,
      ) || [{}])[0],
    }),
    shallowEqual,
  );

  const reject = () => {
    alert('Missing or invalid parameters');
  };

  const onClickAdd = (_: any, rowData: Program) => {
    templateType.programIds = templateType.programIds.concat([rowData._id]);
    dispatch(updateTemplateTypeRequest(templateType, null, reject));
    // Refresh templateType because dispatch makes object read-only, not allowing multiple adding.
    templateType = { ...templateType };
  };

  const onClickDelete = (_: any, rowData: Program) => {
    templateType.programIds = templateType.programIds.filter(elem => elem !== rowData._id);
    dispatch(updateTemplateTypeRequest(templateType, null, reject));
    // Refresh templateType because dispatch makes object read-only, not allowing multiple deleting.
    templateType = { ...templateType };
  };

  const history = useHistory();
  const redirect = () => {
    history.push('/admin/template/type');
  };

  return !templateType ? (
    <Loading message={'Loading...'} />
  ) : (
    <div>
      <ProgramList
        programIds={templateType.programIds}
        onClickAdd={onClickAdd}
        onClickDelete={onClickDelete}
      />
      <Button onClick={redirect} variant="contained" color="primary" style={{ marginTop: '0.8%' }}>
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
    </div>
  );
};


const TemplateType = (props: RouteComponentProps<propType>) => (
  <div className="templateTypePage">
    <TemplateTypeHeader />
    <TemplateTypeTable {...props} />
    <LinkProgramTable {...props} />
  </div>
);

export default TemplateType;
