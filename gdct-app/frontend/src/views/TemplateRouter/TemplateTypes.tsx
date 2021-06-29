import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Action, Column } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';


import {
  getTemplateTypesRequest,
  createTemplateTypeRequest,
  deleteTemplateTypeRequest,
  updateTemplateTypeRequest,
  //@ts-ignore
} from '../../store/thunks/templateType';

  //@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
  //@ts-ignore
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
  //@ts-ignore
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
  //@ts-ignore
import { getWorkflowsRequest } from '../../store/thunks/workflow';
  //@ts-ignore
import { WorkflowStoreActions } from '../../store/WorkflowStore/store';
  //@ts-ignore
import TemplateTypesStore from '../../store/TemplateTypesStore/store';
  //@ts-ignore
import ErrorBanner from '../ErrorBanner';
  //@ts-ignore
  //@ts-ignore
import { calculateOptions } from '../../tools/misc';
//@ts-ignore
import moment from 'moment';
  //@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
  //@ts-ignore
import templateTypeController from '../../controllers/templateType';

import TemplateType from '../../types/templatetype';
import Workflow from '../../types/workflow';
import { RouterProps } from 'react-router';

interface TemplateTypeMT extends TemplateType {
  tableData?: any,
}

const TemplateTypeHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Type</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

// Prepare the data for material table
const TemplateTypesTable = ({ history }: RouterProps) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [hasTypes, setHasTypes] = useState(false);

  const preColumns: Column<TemplateTypeMT>[] = [{ title: 'Name', field: 'name' }]
  const preTypes: TemplateTypeMT[] = [{
    name: 'LOADING...',
    _id: '',
    description: '',
    programId: [],
    isActive: false,
    isApprovable: false,
    isInputtable: false,
    isReportable: false,
    isReviewable: false,
    isSubmittable: false,
    isViweable: false,
    programIds: [],
    timestamp: '',
    updatedAt: '',
    updatedBy: '',
  }]

  const { templateTypes, workflows }: {
    templateTypes: TemplateType[],
    workflows: Workflow[],
  } = useSelector(
    state => ({
      templateTypes: selectFactoryRESTResponseTableValues(selectTemplateTypesStore)(state),
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  templateTypes.forEach(templateType => {
    const logtime = new Date(templateType.timestamp);
    templateType.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  // Config the lookup function for columns
  const lookupWorkflows = workflows.reduce(function (acc: {[key: string]: string}, workflow) {
    acc[workflow._id] = `${workflow.name}`;
    return acc;
  }, {});

  useEffect(() => {
    setRowNum(templateTypes.length);
    if (!hasTypes) {
      setHasTypes(templateTypes.length >= 1);
    }
  }, [templateTypes]);

  // Prepare the columns for material table
  const columns: Column<TemplateTypeMT>[] = [
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
    {
      title: 'Modified On',
      field: 'timestamp',
      editComponent: props => {
        return <div></div>;
      },
    },
    {
      title: 'Updated By',
      field: 'updatedBy',
      editComponent: props => {
        return <div></div>;
      },
    },
    { title: 'Active', type: 'boolean', field: 'isActive' },
  ];

  // Prepare the actions for the material table
  const actions: Action<TemplateTypeMT>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'View Programs',
        onClick: (_: any, templateType: TemplateTypeMT | TemplateTypeMT[]) => {
          if (!Array.isArray(templateType)) {
            history.push(`/admin/template/type/${templateType._id}`);
          }
        },
      },
    ],
    [history],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(templateType: TemplateTypeMT) {
    templateType.updatedBy = localStorage.getItem('currentUser') || '';
    templateType.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (templateType: TemplateTypeMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          dispatch(createTemplateTypeRequest(templateType, resolve, reject));
        }).then(newTemplateType => {
          // For Auditlog
          if (newTemplateType) {
            CreateAuditLog(
              null,
              "Create Template Type",
              "TemplateType",
              (newTemplateType as TemplateType)._id,
              {},
              newTemplateType
            );
          }
        }),
      onRowUpdate: (templateType: TemplateTypeMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldTemplateType = await templateTypeController.fetchById(templateType._id);
            CreateAuditLog(
              null,
              'Update Template Type',
              'TemplateType',
              oldTemplateType._id,
              oldTemplateType,
              templateType,
            );
          })();
          // Do Update
          dispatch(updateTemplateTypeRequest(templateType, resolve, reject));
        }),
      onRowDelete: (templateType: TemplateTypeMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          dispatch(deleteTemplateTypeRequest(templateType._id, resolve, reject));
          // For Auditlog
          const templateType_trim = (({ tableData, ...o }) => o)(templateType);
          CreateAuditLog(
            null,
            'Delete Template Type',
            'TemplateType',
            templateType._id,
            templateType_trim,
            {},
          );
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
      key={readRowNum}
      columns={hasTypes ? columns : preColumns}
      actions={hasTypes ? actions : undefined}
      data={hasTypes ? templateTypes : preTypes}
      editable={hasTypes ? editable : undefined}
      options={options}
    />
  );
};

const TemplateType = (props: RouterProps) => (
  <div className="templateTypesPage">
    <TemplateTypeHeader />
    <ErrorBanner
      title={'The template type you are trying to delete is referenced in one or more submissions'}
      targetStore={selectTemplateTypesStore}
    />
    <TemplateTypesTable {...props} />
  </div>
);

export default TemplateType;
