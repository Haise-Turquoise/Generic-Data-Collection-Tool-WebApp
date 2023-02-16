// Last Update: Oct 16, 2020
// This file shows a page where a list of templates present in the database is displayed
// Users have the option of opening, editing, or deleting a template

import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import LaunchIcon from '@material-ui/icons/Launch';
import Paper from '@material-ui/core/Paper';

import Typography from '@material-ui/core/Typography';
import {
  getTemplatesRequest,
  createTemplateRequest,
  deleteTemplateRequest,
  updateTemplateRequest,
} from '../../../store/thunks/template';

import './Templates.scss';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTLookup,
  selectFactoryRESTResponseValues,
} from '../../../store/common/REST/selectors';
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import { getTemplateTypesRequest } from '../../../store/thunks/templateType';
import { selectTemplateTypesStore } from '../../../store/TemplateTypesStore/selectors';
import TemplatesStore from '../../../store/TemplatesStore/store';
import TemplateTypesStore from '../../../store/TemplateTypesStore/store';
//@ts-ignore
//@ts-ignore
import { getWorkflowProcessesRequest } from '../../../store/thunks/workflow';
import { selectWorkflowProcessesStore } from '../../../store/WorkflowProcessesStore/selectors';
import WorkflowProcessesStore from '../../../store/WorkflowProcessesStore/store';
//@ts-ignore
import { calculateOptions, checkDuplicates, formatTimestamp } from '../../../tools/misc';
import { RouterProps } from 'react-router';
import WorkflowProcess from '../../../types/workflowprocess';
import Template from '../../../types/template';
import CreateAuditLog from '../../AuditLog_Global';

// const TemplateFileDropzone = () => {}

// TODO : Finish Excel integration
const TemplateHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Design</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatesTable = ({ history }: RouterProps) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const [readIndex, setIndex] = useState<{[key: string]: string, [key: number]: string} | undefined>();
  const [readTemplate, setTemplate] = useState<Template[] | undefined>();
  const [readIndexName, setIndexName] = useState<{[key: string]: string, [key: number]: string} | undefined>();
  const { templates, lookupTemplateTypes, workflowProcesses }: {
    templates: Template[],
    lookupTemplateTypes: {[key: string]: string},
    workflowProcesses: WorkflowProcess[],
  } = useSelector(
    state => ({
      templates: selectFactoryRESTResponseTableValues(selectTemplatesStore)(state),
      lookupTemplateTypes: selectFactoryRESTLookup(selectTemplateTypesStore)(state),
      workflowProcesses: selectFactoryRESTResponseValues(selectWorkflowProcessesStore)(state),
    }),
    shallowEqual,
  );
  const lookupProcesses = workflowProcesses.reduce((acc: {[key: string]: string}, value: WorkflowProcess) => {
    acc[value._id!] = value.statusId.name;
    return acc;
  }, {});

  useEffect(()=>{
    // console.log('lookupTemplateTypes', lookupTemplateTypes)
    const keys = Object.keys(lookupTemplateTypes);
    const nameArray: string[] = [];

    keys.forEach(key=>{
      nameArray.push(lookupTemplateTypes[key]);
    });

    const sortedNameArray = nameArray.sort();
    
    const IdToIndex = new Map();
    const IndexToId: {[key: number]: string} = {};
    const IndexToName: {[key: number]: string} = {};

    keys.forEach(key=>{
      const index = sortedNameArray.indexOf(lookupTemplateTypes[key]);
      IdToIndex.set(String(key), index);
      IndexToId[index]=String(key);
      IndexToName[index]=lookupTemplateTypes[key];
    })

    const modifiedTemplates: Template[] = [];

    templates.forEach(template=>{
      const Id = String(template.templateTypeId);
      const modifiedTemplate = Object.assign({}, template)
      modifiedTemplate.templateTypeId = IdToIndex.get(Id);
      modifiedTemplates.push(modifiedTemplate);
    });
    
    setTemplate(modifiedTemplates);
    setIndex(IndexToId);
    setIndexName(IndexToName);
  
  }, [templates, lookupTemplateTypes]);
  

  const columns = useMemo(
    () => [
      //@ts-ignore
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, readTemplate, 'name')},
      {
        title: 'Template Type ID',
        field: 'templateTypeId',
        lookup: readIndexName,
      },
      {
        title: 'Creation Date',
        // type: 'date',
        field: 'createdAt',
        editComponent: (props: any) => {
          return <div></div>;
        },
        // editable: 'onAdd',
        // initialEditValue: new Date(),
      },
      { title: 'Expiration Date', field: 'expirationDate' },
      { title: 'Workflow', field: 'workflowProcessId', lookup: lookupProcesses, editable: 'never' },
      {
        title: 'Modified On',
        field: 'updatedAt',
        editComponent: (props: any) => {
          return <div></div>;
        },
        defaultSort: 'desc'
      },
      //      { title: 'Modified On', field: 'updatedDate', type: 'date',
      //      initialEditValue: Date.now,},
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: (props: any) => {
          return <div></div>;
        },
      },
    ],
    [lookupTemplateTypes, lookupProcesses],
  );

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Template',
        onClick: (_event: MouseEvent, template: Template) => {
          history.push(`/admin/template/design/${template._id}`);
        },
      },
    ],
    [history],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);
  const foo = async  (template: Template) => {
    let oldTemplate = await dispatch(getTemplatesRequest(template._id ));
    console.log(oldTemplate)
    return oldTemplate 
  };

  const editable = useMemo(
    () => ({
      onRowAdd: (template: Template) =>
        new Promise((resolve, reject) => {
          // get username and record in Modified By column
          template.updatedBy = localStorage.getItem('currentUser') || '';
          // record new date and time in Modified On column
          const event = new Date();
          template.updatedAt = event.toLocaleString(); 
          const convertedTemplate = Object.assign({}, template);
          convertedTemplate.templateTypeId = (readIndex && readIndex[template.templateTypeId]) || '';
          dispatch(createTemplateRequest(convertedTemplate, resolve, reject));
          //AUDITLOG
          CreateAuditLog(null, "Create Template", "Template", convertedTemplate._id, {}, convertedTemplate);
        }),
      onRowUpdate: (template: Template) =>
        new Promise((resolve, reject) => {
          // get username and record in Modified By column
          foo(template)
          template.updatedBy = localStorage.getItem('currentUser') || '';
          // record new date and time in Modified On column
          const event = new Date();
          template.updatedAt = event.toLocaleString();
          delete template.templateData;
          const convertedTemplate = Object.assign({}, template);
          convertedTemplate.templateTypeId = (readIndex && readIndex[template.templateTypeId]) || '';
          dispatch(updateTemplateRequest(convertedTemplate, resolve, reject));
          CreateAuditLog(null, "Update Template Design", "Template", convertedTemplate._id, {}, convertedTemplate);
        }),
      onRowDelete: (template: Template) =>
        new Promise((resolve, reject) => {
          // get username and record in Modified By column
          template.updatedBy = localStorage.getItem('currentUser') || '';
          // record new date and time in Modified On column
          const template_trim = (({ templateData, ...o }) => o)(template);
          const event = new Date();
          template.updatedAt = event.toLocaleString(); 
          const convertedTemplate = Object.assign({}, template);
          convertedTemplate.templateTypeId = (readIndex && readIndex[template.templateTypeId]) || '';
          dispatch(deleteTemplateRequest(convertedTemplate._id, resolve, reject));

          //auditlog
          CreateAuditLog(null, "Delete Template", "Template", convertedTemplate._id, template_trim, {});
        }),
    }),
    [dispatch, readIndex],
  );

  // Convert Date format
  templates.forEach(template => {
    template.createdAt = formatTimestamp(template.createdAt)
    template.updatedAt = formatTimestamp(template.updatedAt)
    template.expirationDate = formatTimestamp(template.expirationDate)
  });

  useEffect(() => {
    dispatch(getTemplatesRequest());
    dispatch(getTemplateTypesRequest());
    dispatch(getWorkflowProcessesRequest({}));

    return () => {
      dispatch(TemplatesStore.actions.RESET(''));
      dispatch(WorkflowProcessesStore.actions.RESET(''));
      dispatch(TemplateTypesStore.actions.RESET(''));
    };
  }, [dispatch]);

  useEffect(() => {
    setRowNum(templates.length);
  }, [templates]);
  return (
    // @ts-ignore
    <MaterialTable
      key={readRowNum}
      columns={columns}
      actions={actions}
      data={readTemplate}
      editable={editable}
      options={options}
    />
  );
};

const Template = (props: RouterProps) => (
  <div className="templatesPage">
    <TemplateHeader />
    {/* <FileDropzone/> */}
    <TemplatesTable {...props} />
  </div>
);

export default Template;
