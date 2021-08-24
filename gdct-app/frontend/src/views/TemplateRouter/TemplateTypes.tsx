import React, { useMemo, useEffect, useState } from 'react';
import MaterialTable, { Action, Column } from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import { Paper, Typography } from '@material-ui/core';
import { selectTemplateTypesStore } from '../../store/TemplateTypesStore/selectors';
import ErrorBanner from '../ErrorBanner';
import {
    calculateOptions,
    controllerAddRow,
    controllerEditRow,
    controllerDeleteRow,
    formatTimestamp,
    fetchWithStatus,
} from '../../tools/misc';
import CreateAuditLog from '../AuditLog_Global';
import templateTypeController from '../../controllers/templateType';
import WorkflowController from '../../controllers/workflow'

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
    </Paper>
  );
};

// Prepare the data for material table
const TemplateTypesTable = ({ history }: RouterProps) => {
  const [readRowNum, setRowNum] = useState(1);
  const [templateTypes, setTemplateTypes] =
    useState<TemplateType[] | undefined>(undefined)
  const [workflows, setWorkflows] =
    useState<Workflow[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<TemplateType>(templateTypeController, setTemplateTypes, setStatus)
    WorkflowController.fetch().then((res: unknown) => {
      setWorkflows(res as Workflow[])
    })
  }, [])

  const preColumns: Column<TemplateTypeMT>[] = [{ title: 'Name', field: 'name' }]
  const preTypes: TemplateTypeMT[] = [{
    name: status,
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
  // Convert Date format
  templateTypes?.forEach(templateType => {
    templateType.updatedAt = formatTimestamp(templateType.updatedAt);
  });

  // Config the lookup function for columns
  const lookupWorkflows = workflows?.reduce(function (acc: {[key: string]: string}, workflow) {
    acc[workflow._id] = `${workflow.name}`;
    return acc;
  }, {});

  useEffect(()=>{
    setRowNum(templateTypes?.length || 1)
  }, [templateTypes])
  
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
      field: 'updatedAt',
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
        new Promise<TemplateType | undefined>((resolve, reject) => {
          recordUpdate(templateType);
          controllerAddRow(templateTypeController, setTemplateTypes, templateType)
            .then((res?: TemplateType) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newTemplateType => {
          // For Auditlog
          if (newTemplateType) {
            CreateAuditLog(
              null,
              "Create Template Type",
              "TemplateType",
              newTemplateType._id,
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
              oldTemplateType?._id,
              oldTemplateType,
              templateType,
            );
          })();
          // Do Update
          controllerEditRow(templateTypeController, setTemplateTypes, templateType)
            .then((res: boolean) => {
              if (res) {
                resolve(templateType)
              }
              reject()
            })
        }),
      onRowDelete: (templateType: TemplateTypeMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templateType);
          controllerDeleteRow(templateTypeController, setTemplateTypes, templateType._id)
            .then((res: boolean) => {
              if (res) {
                resolve(templateType)
              }
              reject()
            })
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
    [],
  );

  return (
    <MaterialTable
      key={readRowNum}
      columns={!!templateTypes ? columns : preColumns}
      actions={!!templateTypes ? actions : undefined}
      data={!!templateTypes ? templateTypes : preTypes} 
      editable={!!templateTypes ? editable : undefined}
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
