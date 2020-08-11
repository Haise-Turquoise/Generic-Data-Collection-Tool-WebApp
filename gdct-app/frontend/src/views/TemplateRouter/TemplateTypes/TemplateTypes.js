import React, { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getTemplateTypesRequest,
  createTemplateTypeRequest,
  deleteTemplateTypeRequest,
  updateTemplateTypeRequest,
} from '../../../store/thunks/templateType';

import './TemplateTypes.scss';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectTemplateTypesStore } from '../../../store/TemplateTypesStore/selectors';
import { selectWorkflowsStore } from '../../../store/WorkflowsStore/selectors';
import { getWorkflowsRequest } from '../../../store/thunks/workflow';
import { WorkflowStoreActions } from '../../../store/WorkflowStore/store';
import TemplateTypesStore from '../../../store/TemplateTypesStore/store';

const TemplateTypeHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Types</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplateTypesTable = ({ history }) => {
  const dispatch = useDispatch();

  const { templateTypes, workflows } = useSelector(
    state => ({
      templateTypes: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state),
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );

  const lookupWorkflows = workflows.reduce(function (acc, workflow) {
    acc[workflow._id] = `${workflow.name}`;
    return acc;
  }, {});

  const columns = [
    { title: 'Name', field: 'name' },
    { title: 'Description', field: 'description' },
    { title: 'Submission Workflow', field: 'submissionWorkflowId', lookup: lookupWorkflows },
    { title: 'Template Workflow', field: 'templateWorkflowId', lookup: lookupWorkflows },
    // { title: 'Approvable', type: 'boolean', field: 'isApprovable' },
    // { title: 'Reviewable', type: 'boolean', field: 'isReviewable' },
    // { title: 'Submittable', type: 'boolean', field: 'isSubmittable' },
    // { title: 'Inputtable', type: 'boolean', field: 'isInputtable' },
    // { title: 'Viewable', type: 'boolean', field: 'isViewable' },
    // { title: 'Reportable', type: 'boolean', field: 'isReportable' },
    { title: 'Active', type: 'boolean', field: 'isActive' },
  ];

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'View Programs',
        onClick: (_event, templateType) => {
          history.push(`/admin/template/type/${templateType._id}`);
        },
      },
    ],
    [history],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: true, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: templateType =>
        new Promise((resolve, reject) => {
          dispatch(createTemplateTypeRequest(templateType, resolve, reject));
        }),
      onRowUpdate: templateType =>
        new Promise((resolve, reject) => {
          dispatch(updateTemplateTypeRequest(templateType, resolve, reject));
        }),
      onRowDelete: templateType =>
        new Promise((resolve, reject) => {
          dispatch(deleteTemplateTypeRequest(templateType._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getWorkflowsRequest());
    dispatch(getTemplateTypesRequest());

    return () => {
      dispatch(WorkflowStoreActions.RESET());
      dispatch(TemplateTypesStore.actions.RESET());
    };
  }, [dispatch]);

  return (
    <MaterialTable
      columns={columns}
      actions={actions}
      data={templateTypes}
      editable={editable}
      options={options}
    />
  );
};

const TemplateType = props => (
  <div className="templateTypesPage">
    <TemplateTypeHeader />
    {/* <FileDropzone/> */}
    <TemplateTypesTable {...props} />
  </div>
);

export default TemplateType;
