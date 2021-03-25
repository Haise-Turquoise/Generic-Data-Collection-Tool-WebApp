import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';

import {
  getTemplateTypesRequest,
  createTemplateTypeRequest,
  deleteTemplateTypeRequest,
  updateTemplateTypeRequest,
} from '../../store/thunks/templateType';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
import { getWorkflowsRequest } from '../../store/thunks/workflow';
import { WorkflowStoreActions } from '../../store/WorkflowStore/store';
import TemplateTypesStore from '../../store/TemplateTypesStore/store';
import ErrorBanner from '../ErrorBanner';
import { calculateOptions } from '../../tools/misc';
import moment from 'moment';
import CreateAuditLog from '../AuditLog_Global';
import templateTypeController from '../../controllers/templateType';

const TemplateTypeHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Type</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// Prepare the data for material table
const TemplateTypesTable = ({ history }) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);

  const { templateTypes, workflows } = useSelector(
    state => ({
      templateTypes: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state),
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  templateTypes.forEach(templateType => {
    const logtime = new Date(templateType.timestamp);
    templateType.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  // Config the lookup function for columns
  const lookupWorkflows = workflows.reduce(function (acc, workflow) {
    acc[workflow._id] = `${workflow.name}`;
    return acc;
  }, {});

  useEffect(()=>{setRowNum(templateTypes.length)}, [templateTypes])
  
  // Prepare the columns for material table
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
    { title: 'Modified On', field: 'timestamp', editComponent: props => {return <div></div>} },
    { title: 'Updated By', field: 'updatedBy', editComponent: props => {return <div></div>} },
    { title: 'Active', type: 'boolean', field: 'isActive' },
  ];

  // Prepare the actions for the material table
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

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(templateType) {
    templateType.updatedBy = localStorage.getItem('currentUser');
    templateType.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: templateType =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          dispatch(createTemplateTypeRequest(templateType, resolve, reject));
        }).then(newTemplateType => {
          // For Auditlog
          CreateAuditLog(null, "Create Template Type", "TemplateType", newTemplateType._id, {}, newTemplateType);
        }),
      onRowUpdate: templateType =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldTemplateType = await templateTypeController.fetchById(templateType._id);
            CreateAuditLog(null, "Update Template Type", "TemplateType", oldTemplateType._id, oldTemplateType, templateType);
          })();
          // Do Update
          dispatch(updateTemplateTypeRequest(templateType, resolve, reject));
        }),
      onRowDelete: templateType =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          dispatch(deleteTemplateTypeRequest(templateType._id, resolve, reject));
          // For Auditlog
          const templateType_trim = (({ tableData, ...o }) => o)(templateType);
          CreateAuditLog(null, "Delete Template Type", "TemplateType", templateType._id, templateType_trim, {});
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
    // @ts-ignore
    <MaterialTable key={readRowNum} columns={columns} actions={actions} data={templateTypes} editable={editable} options={options} />
  );
};

const TemplateType = props => (
  <div className="templateTypesPage">
    <TemplateTypeHeader />
    <ErrorBanner title={"The template type you are trying to delete is referenced in one or more submissions"} targetStore={selectTemplateTypesStore}/>
    <TemplateTypesTable {...props} />
  </div>
);

export default TemplateType;
