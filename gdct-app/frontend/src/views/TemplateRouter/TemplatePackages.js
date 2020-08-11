import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';

import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';

import { cloneDeep } from 'lodash';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
import { selectTemplatePackagesStore } from '../../store/TemplatePackagesStore/selectors';
import {
  getTemplatePackagesRequest,
  createTemplatePackageRequest,
  deleteTemplatePackageRequest,
  updateTemplatePackageRequest,
} from '../../store/thunks/templatePackage';
import { ROUTE_TEMPLATE_PCKGS_PCKGS } from '../../constants/routes';
import { TemplatePackagesStoreActions } from '../../store/TemplatePackagesStore/store';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
import { getStatusesRequest } from '../../store/thunks/status';
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';
import StatusesStore from '../../store/StatusesStore/store';
import SubmissionPeriodsStore from '../../store/SubmissionPeriodsStore/store';

const TemplatePackageHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Packages</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatePackages = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { templatePackages, lookupStatuses, lookupSubmissionPeriods } = useSelector(
    state => ({
      isCallInProgress: selectFactoryRESTIsCallInProgress(selectTemplatePackagesStore)(state),
      templatePackages: selectFactoryRESTResponseTableValues(selectTemplatePackagesStore)(state),
      lookupStatuses: selectFactoryRESTLookup(selectStatusesStore)(state),
      lookupSubmissionPeriods: selectFactoryRESTLookup(selectSubmissionPeriodsStore)(state),
    }),
    shallowEqual,
  );

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Package',
        onClick: (_event, pckg) => history.push(`${ROUTE_TEMPLATE_PCKGS_PCKGS}/${pckg._id}`),
      },
    ],
    [dispatch],
  );

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'SubmissionPeriodId',
        field: 'submissionPeriodId',
        lookup: lookupSubmissionPeriods,
      },
      // { title: "TemplateIds", type: "boolean", field: "templateIds" },
      { title: 'StatusId', field: 'statusId', lookup: lookupStatuses },
      { title: 'Creation Date', field: 'creationDate', type: 'date' },
    ],
    [lookupStatuses, lookupSubmissionPeriods],
  );

  const options = useMemo(
    () => ({
      actionsColumnIndex: -1,
      search: false,
      showTitle: false,
    }),
    [],
  );

  const editable = useMemo(
    () => ({
      onRowAdd: templatePackage =>
        new Promise((resolve, reject) => {
          templatePackage = { ...templatePackage, templateIds: [], programIds: [] };
          dispatch(createTemplatePackageRequest(templatePackage, resolve, reject));
        }),
      onRowUpdate: templatePackage =>
        new Promise((resolve, reject) => {
          dispatch(updateTemplatePackageRequest(templatePackage, resolve, reject));
        }),
      onRowDelete: templatePackage =>
        new Promise((resolve, reject) => {
          dispatch(deleteTemplatePackageRequest(templatePackage._id, resolve, reject));
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getTemplatePackagesRequest());
    dispatch(getStatusesRequest());
    dispatch(getSubmissionPeriodsRequest());

    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
      dispatch(StatusesStore.actions.RESET());
      dispatch(SubmissionPeriodsStore.actions.RESET());
    };
  }, [dispatch]);

  return (
    <div>
      <TemplatePackageHeader />
      <MaterialTable
        columns={columns}
        data={templatePackages}
        editable={editable}
        options={options}
        actions={actions}
      />
    </div>
  );
};

export default TemplatePackages;
