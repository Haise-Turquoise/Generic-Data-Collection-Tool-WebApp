import React, { useCallback, useMemo, useEffect } from 'react';
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
} from '../../../store/common/REST/selectors';
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import { getStatusesRequest } from '../../../store/thunks/status';
import { getTemplateTypesRequest } from '../../../store/thunks/templateType';
import { selectStatusesStore } from '../../../store/StatusesStore/selectors';
import { selectTemplateTypesStore } from '../../../store/TemplateTypesStore/selectors';

// const TemplateFileDropzone = () => {}

// TODO : Finish Excel integration
const TemplateHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Templates</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatesTable = ({ history }) => {
  const dispatch = useDispatch();

  const { templates, lookupStatuses, lookupTemplateTypes } = useSelector(
    state => ({
      templates: selectFactoryRESTResponseTableValues(selectTemplatesStore)(state),
      lookupStatuses: selectFactoryRESTLookup(selectStatusesStore)(state),
      lookupTemplateTypes: selectFactoryRESTLookup(selectTemplateTypesStore)(state),
    }),
    shallowEqual,
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'TemplateTypeId',
        field: 'templateTypeId',
        lookup: lookupTemplateTypes,
      },
      { title: 'CreationDate', type: 'date', field: 'creationDate' },
      { title: 'ExpirationDate', type: 'date', field: 'expirationDate' },
      { title: 'StatusId', field: 'statusId', lookup: lookupStatuses },
    ],
    [lookupTemplateTypes, lookupStatuses],
  );

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Template',
        onClick: (_event, template) => history.push(`/admin/template/design/${template._id}`),
      },
    ],
    [history],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: false }), []);

  const editable = useMemo(
    () => ({
      onRowAdd: template =>
        new Promise((resolve, reject) => {
          dispatch(createTemplateRequest(template, resolve, reject));
        }),
      onRowUpdate: template =>
        new Promise((resolve, reject) => {
          dispatch(updateTemplateRequest(template, resolve, reject));
        }),
      onRowDelete: template =>
        new Promise((resolve, reject) => {
          dispatch(deleteTemplateRequest(template._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getTemplatesRequest());
    dispatch(getStatusesRequest());
    dispatch(getTemplateTypesRequest());
  }, [dispatch]);

  return (
    <MaterialTable
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
