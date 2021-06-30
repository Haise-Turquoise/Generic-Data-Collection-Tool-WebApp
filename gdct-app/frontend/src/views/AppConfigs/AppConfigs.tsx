import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Column, Options } from 'material-table';
import { Paper, Typography } from '@material-ui/core';

import moment from 'moment';

import {
  getAppConfigsRequest,
  createAppConfigRequest,
  deleteAppConfigRequest,
  updateAppConfigRequest,
  //@ts-ignore
} from '../../store/thunks/AppConfig';
//@ts-ignore
import { getAppSysesRequest } from '../../store/thunks/AppSys';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectAppConfigsStore } from '../../store/AppConfigsStore/selectors';
//@ts-ignore
import { selectAppSysesStore } from '../../store/AppSysesStore/selectors';
//@ts-ignore
import AppConfigController from '../../controllers/AppConfig';
//@ts-ignore
import AppSysController from '../../controllers/AppSys';
//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
import {
  controllerAddRow,
  controllerEditRow,
  controllerDeleteRow,
  //@ts-ignore
} from '../../tools/misc'

import AppConfig from '../../types/appconfig';
import AppSys from '../../types/appsys';

interface AppConfigMT extends AppConfig {
  tableData?: any;
}

const AppConfigsHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Configuration</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const AppConfigsTable = () => {
  const dispatch = useDispatch();
  const [appConfigs, setAppConfigs] = useState<AppConfig[] | undefined>(undefined)
  const [appSyses, setAppSyses] = useState<AppSys[] | undefined>(undefined)

  useEffect(() => {
    AppConfigController.fetch().then((res: unknown) => {
      setAppConfigs(res as AppConfig[])
    })
    AppSysController.fetch().then((res: unknown) => {
      setAppSyses(res as AppSys[])
    })
  }, [])

  // table vars for loading
  const preColumns: Column<AppConfigMT>[] = [{ title: 'Name', field: 'value' }];
  const preConfigs: AppConfigMT[] = [
    {
      value: 'LOADING...',
      _id: '',
      key: '',
      appSys: '',
      sys: '',
      timestamp: '',
      updatedBy: '',
    },
  ];

  // Convert Date format
  appConfigs?.forEach((appConfig: AppConfig) => {
    const logtime = new Date(appConfig.timestamp);
    appConfig.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });
  // Assign code as name
  const lookupSysRoles = appSyses?.reduce(function (acc: {[key:string]: string}, appSys: AppSys) {
    acc[appSys.code] = appSys.name;
    return acc;
  }, {});

  // Prepare the columns for the material table
  const columns: Column<AppConfigMT>[] = useMemo(
    () => [
      { title: 'Key', field: 'key' },
      { title: 'Value', field: 'value' },
      { title: 'System', field: 'appSys', lookup: lookupSysRoles },
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [lookupSysRoles],
  );

  // Prepare the options
  const options: Options<AppConfigMT> = useMemo(
    () => ({
      actionsColumnIndex: -1,
      search: true,
      showTitle: false,
      addRowPosition: 'first',
    }),
    [],
  );

  // Record who and when of the action
  function recordUpdate(appConfig: AppConfigMT) {
    //get username and record in Modified By column
    appConfig.updatedBy = localStorage.getItem('currentUser') || '';
    //record new date and time in Modified On column
    appConfig.timestamp = new Date().toLocaleString();
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (appConfig: AppConfigMT) =>
        new Promise<AppConfig | undefined>((resolve, reject) => {
          recordUpdate(appConfig);
          controllerAddRow(AppConfigController, setAppConfigs, appConfig)
            .then((res: AppConfig) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(newAppConfig => {
          // For Auditlog
          if (newAppConfig) {
            CreateAuditLog(
              null,
              "Add Application Configuration",
              "AppConfig",
              newAppConfig._id,
              {},
              newAppConfig,
            );
          }
        }),

      onRowUpdate: (appConfig: AppConfigMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appConfig);
          // Find the old value before updating for Auditlog
          (async () => {
            const oldAppConfig = await AppConfigController.fetchAppConfig(appConfig._id);
            CreateAuditLog(
              null,
              'Update Application Configuration',
              'AppConfig',
              appConfig._id,
              oldAppConfig,
              appConfig,
            );
          })();
          // Do Update
          controllerEditRow(AppConfigController, setAppConfigs, appConfig)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),

      onRowDelete: (appConfig: AppConfigMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(appConfig);
          // For Auditlog
          const appConfig_trim = (({ tableData, ...o }) => o)(appConfig);
          CreateAuditLog(null, "Delete Application Configuration", "AppConfig", appConfig._id, appConfig_trim, {});
          controllerDeleteRow(AppConfigController, setAppConfigs, appConfig._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }),
    }),
    [],
  );

  return (
    <MaterialTable
      columns={!!appConfigs ? columns : preColumns}
      data={!!appConfigs ? appConfigs : preConfigs}
      editable={!!appConfigs ? editable : undefined}
      options={options}
    />
  );
};

// any because props are unused
const AppConfigs = (props: any) => (
  <div className="AppConfigs">
    <AppConfigsHeader />
    {/* <FileDropzone/> */}
    <AppConfigsTable {...props} />
  </div>
);

export default AppConfigs;
