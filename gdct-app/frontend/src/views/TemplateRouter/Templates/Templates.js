//Last Update: Oct 16, 2020
//This file shows a page where a list of templates present in the database is displayed
//Users have the option of opening, editing, or deleting a template

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
import { getWorkflowProcessesRequest } from '../../../store/thunks/workflow';
import { selectWorkflowProcessesStore } from '../../../store/WorkflowProcessesStore/selectors';
import WorkflowProcessesStore from '../../../store/WorkflowProcessesStore/store';
import { calculateOptions } from '../../../tools/misc'

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

const TemplatesTable = ({ history }) => {
  const dispatch = useDispatch();
  const [readRowNum, setRowNum] = useState(1);
  const { templates, lookupTemplateTypes, workflowProcesses } = useSelector(
    state => ({
      templates: selectFactoryRESTResponseTableValues(selectTemplatesStore)(state),
      lookupTemplateTypes: selectFactoryRESTLookup(selectTemplateTypesStore)(state),
      workflowProcesses: selectFactoryRESTResponseValues(selectWorkflowProcessesStore)(state),
    }),
    shallowEqual,
  );
  const lookupProcesses = workflowProcesses.reduce((acc, value) => {
    acc[value._id] = value.statusId.name;
    return acc;
  }, {});

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'Template Type ID',
        field: 'templateTypeId',
        lookup: lookupTemplateTypes,
      },
      {
        title: 'Creation Date',
        // type: 'date',
        field: 'timestamp',
        // editable: 'onAdd',
        // initialEditValue: new Date(),
      },
      { title: 'Expiration Date', type: 'date', field: 'expirationDate' },
      { title: 'Workflow', field: 'workflowProcessId', lookup: lookupProcesses, editable: 'never'},
      { title: 'Modified On', field: 'timestamp',
        editComponent: props => {return <div></div>} },
//      { title: 'Modified On', field: 'updatedDate', type: 'date',
//      initialEditValue: Date.now,},
      { title: 'Updated By', field: 'updatedBy', 
        editComponent: props => {return <div></div>} },
    ],
    [lookupTemplateTypes, lookupProcesses],
  );

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Template',
        onClick: (_event, template) => {
          history.push(`/admin/template/design/${template._id}`);
        }
      },
    ],
    [history],
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  const editable = useMemo(
    () => ({
      onRowAdd: template =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          template.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          template.timestamp = event.toLocaleString(); 
          dispatch(createTemplateRequest(template, resolve, reject));
        }),
      onRowUpdate: template =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          template.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          template.timestamp = event.toLocaleString(); 
          delete template.templateData;
          dispatch(updateTemplateRequest(template, resolve, reject));
        }),
      onRowDelete: template =>
        new Promise((resolve, reject) => {
          //get username and record in Modified By column
          template.updatedBy=localStorage.getItem('currentUser')
          //record new date and time in Modified On column 
          const event = new Date();
          template.timestamp = event.toLocaleString(); 
          dispatch(deleteTemplateRequest(template._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

    // Convert Date format
    templates.forEach(templates => {

      if(templates.timestamp!=null) {
       const event = new Date(templates.timestamp.toString());
       templates.timestamp = event.toLocaleString(); 
      }else{
       const event = new Date("2021-02-16T03:59:32.015Z");
       templates.timestamp = event.toLocaleString();
      } 
    })

  useEffect(() => {
    dispatch(getTemplatesRequest());
    dispatch(getTemplateTypesRequest());
    dispatch(getWorkflowProcessesRequest());

    return () => {
      dispatch(TemplatesStore.actions.RESET());
      dispatch(WorkflowProcessesStore.actions.RESET());
      dispatch(TemplateTypesStore.actions.RESET());
    };
  }, [dispatch]);

  useEffect(() => { setRowNum(templates.length) }, [templates])

  return (
    <MaterialTable
      key={readRowNum}
      columns={columns}
      actions={actions}
      data={templates}
      editable={editable}
      options={options}
    />
  );
};

const Template = props => (
  <div className="templatesPage">
    <TemplateHeader />
    {/* <FileDropzone/> */}
    <TemplatesTable {...props} />
  </div>
);

export default Template;
