import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import LaunchIcon from '@material-ui/icons/Launch';

import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';

import { useHistory } from 'react-router-dom';
import { UserIdButton, StatusIdButton, SubmissionPeriodIdButton } from '../../components/buttons';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
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
import Loading from '../../components/Loading';

const TemplatePackageHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Packages</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatePackage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { templatePackages, isCallInProgress } = useSelector(
    state => ({
      isCallInProgress: selectFactoryRESTIsCallInProgress(selectTemplatePackagesStore)(state),
      templatePackages: selectFactoryRESTResponseTableValues(selectTemplatePackagesStore)(state),
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
        editComponent: SubmissionPeriodIdButton,
      },
      // { title: "TemplateIds", type: "boolean", field: "templateIds" },
      { title: 'StatusId', field: 'statusId', editComponent: StatusIdButton },
      { title: 'Creation Date', field: 'creationDate', type: 'date' },
    ],
    [],
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
          console.log(templatePackage);
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

    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
    };
  }, [dispatch]);

  // HOTFIX
  const isPopulated = useMemo(
    () => !!(templatePackages.length && typeof templatePackages[0].submissionPeriodId === 'object'),
    [templatePackages],
  );

  return isCallInProgress || isPopulated ? (
    <Loading />
  ) : (
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

export default TemplatePackage;
