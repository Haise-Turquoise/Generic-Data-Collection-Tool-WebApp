import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Paper, Typography } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

import MaterialTable, { Action, Column, Options } from 'material-table';
import moment from 'moment';

import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
  selectFactoryRESTLookup,
  //@ts-ignore
} from '../../store/common/REST/selectors';
  //@ts-ignore
import { selectTemplatePackagesStore } from '../../store/TemplatePackagesStore/selectors';
import {
  getTemplatePackagesRequest,
  createTemplatePackageRequest,
  deleteTemplatePackageRequest,
  updateTemplatePackageRequest,
  //@ts-ignore
} from '../../store/thunks/templatePackage';
  //@ts-ignore
import { ROUTE_TEMPLATE_PCKGS_PCKGS } from '../../constants/routes';
  //@ts-ignore
import { TemplatePackagesStoreActions } from '../../store/TemplatePackagesStore/store';
  //@ts-ignore
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
  //@ts-ignore
import { getStatusesRequest } from '../../store/thunks/status';
  //@ts-ignore
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
  //@ts-ignore
import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';
  //@ts-ignore
import StatusesStore from '../../store/StatusesStore/store';
  //@ts-ignore
import SubmissionPeriodsStore from '../../store/SubmissionPeriodsStore/store';
  //@ts-ignore
import ErrorBanner from '../ErrorBanner';
  //@ts-ignore
import { calculateOptions } from '../../tools/misc';
  //@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
  //@ts-ignore
import templatePackageController from '../../controllers/templatePackage';

import TemplatePackage from '../../types/templatepackage';
import Status from '../../types/status';
import SubmissionPeriod from '../../types/submissionperiod';

interface TemplatePackageMT extends TemplatePackage {
  tableData?: any,
}


const TemplatePackageHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Package</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const TemplatePackages = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [readRowNum, setRowNum] = useState(1);
  const [templatePackages, setTemplatePackages] = 
    useState<TemplatePackage[] | undefined>(undefined)

  useEffect(() => {
    templatePackageController.fetch().then((res: unknown) => {
      setTemplatePackages(res as TemplatePackage[])
    })
  }, [])

  // table vars while loading
  const preColumns: Column<TemplatePackageMT>[] = [{ title: 'Name', field: 'name' }]
  const prePackages: TemplatePackageMT[] = [{
    name: 'LOADING...',
    _id: '',
    creationDate: '',
    programIds: [],
    statusId: '',
    submissionPeriodId: '',
    templateIds: [],
    timestamp: '',
    updatedBy: '',
  }]

  // Prepare the data for material table
  const {
    lookupStatuses,
    lookupSubmissionPeriods,
    WholeLookupStatuses,
  }: {
    lookupStatuses: {[key: string]: string},
    lookupSubmissionPeriods: {[key: string]: string},
    WholeLookupStatuses: Status[],
  } = useSelector(
    state => ({
      isCallInProgress: selectFactoryRESTIsCallInProgress(selectTemplatePackagesStore)(state),
      lookupStatuses: selectFactoryRESTLookup(selectStatusesStore)(state),
      lookupSubmissionPeriods: selectFactoryRESTLookup(selectSubmissionPeriodsStore)(state),
      WholeLookupStatuses: selectFactoryRESTResponseTableValues(selectStatusesStore)(state),
    }),
    shallowEqual,
  );

  // Convert Date format
  templatePackages?.forEach(templatePackage => {
    const logtime = new Date(templatePackage.timestamp);
    const creationDate = new Date(templatePackage.creationDate);
    templatePackage.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss");
    templatePackage.creationDate = moment(creationDate).format("YYYY-MM-DD HH:mm:ss");
  });

  // Prepare the actions for material table
  const actions: Action<TemplatePackageMT>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Package',
        onClick: (_: any, pckg: TemplatePackageMT | TemplatePackageMT[]) => {
          if (!Array.isArray(pckg)) {
            history.push(`${ROUTE_TEMPLATE_PCKGS_PCKGS}/${pckg._id}`)
          }
        },
      },
    ],
    [dispatch],
  );

  // Prepare the columns for material table
  const columns: Column<TemplatePackageMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Submission Period ID', field: 'submissionPeriodId', lookup: lookupSubmissionPeriods },
      {
        title: 'Status ID',
        field: 'statusId',
        lookup: lookupStatuses,

        editComponent: (props) => {
          console.log('PROPS', props)
          const optionList = [];
          // ignoring these for now because optionList is unused
          //@ts-ignore
          for (const key in props.columnDef.lookup) {
            optionList.push({
              value: key,
              //@ts-ignore
              label: props.columnDef.lookup[key],
            });
          }

          const optionListForPackage: { value: string, label: string }[] = [];
          WholeLookupStatuses.forEach(status => {
            if (status.forPackage) {
              optionListForPackage.push({
                value: status._id,
                label: status.name,
              });
            }
          });
          function isEmpty(obj: Object) {
            return Object.keys(obj).length === 0;
          }
          if (isEmpty(props.rowData) || !props.rowData.templateIds) {
            // console.log(WholeLookupStatuses)
            WholeLookupStatuses.forEach(status => {
              status.name == 'in progress' ? (props.rowData.statusId = status._id) : {};
            });
            return <div>in progress</div>;
          }
          if (props.rowData.templateIds.length == 0 || props.rowData.programIds.length == 0) {
            // console.log('forPackage');
            const optionInProgress: { value: string, label: string }[] = [];
            WholeLookupStatuses.forEach(status => {
              status.name == 'in progress'
                ? optionInProgress.push({ value: status._id, label: status.name })
                : {};
            });
            // console.log(optionInProgress)

            return (
              <Select
                onChange={data => {
                  props.onChange(data?.value);
                }}
                // options={optionListForPackage}/>
                // options={[{ value: '5fc53f2af05fb45fed6c88b1', label: 'in progress' }]}
                options={optionInProgress}
              />
            );
          }
          return (
            <Select
              onChange={(data) => {
                props.onChange(data?.value);
              }}
              options={optionListForPackage}
            />
          );

          // return <Select  options={optionList}/>
        },
      },
      { title: 'Creation Date', field: 'creationDate', editComponent: () => {return <div></div>} },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    [lookupStatuses, lookupSubmissionPeriods],
  );

  const options: Options<TemplatePackageMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(templatePackage: TemplatePackageMT) {
    templatePackage.updatedBy = localStorage.getItem('currentUser') || '';
    templatePackage.timestamp = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (templatePackage: TemplatePackageMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templatePackage);
          templatePackage = { ...templatePackage, templateIds: [], programIds: [] };
          templatePackage.creationDate = moment().format();
          dispatch(createTemplatePackageRequest(templatePackage, resolve, reject));
        }).then(newTemplatePackage => {
          // For Auditlog
          if (newTemplatePackage) {
            CreateAuditLog(
              null,
              "Create Template Package",
              "TemplatePackage",
              (newTemplatePackage as TemplatePackage)._id,
              {},
              newTemplatePackage
            );
          }
        }),

      onRowUpdate: (templatePackage: TemplatePackageMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templatePackage);
          console.log(templatePackage);
          // Find the old value before updating in order to Auditlog
          (async () => { 
            const oldTemplatePackage = await templatePackageController.fetchTemplatePackage(templatePackage._id);
            CreateAuditLog(null, "Update Template Package", "TemplatePackage", oldTemplatePackage._id, oldTemplatePackage, templatePackage);
          })();
          // Do Update
          dispatch(updateTemplatePackageRequest(templatePackage, resolve, reject));
        }),
        
      onRowDelete: (templatePackage: TemplatePackageMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templatePackage);
          dispatch(deleteTemplatePackageRequest(templatePackage._id, resolve, reject));
          // For Auditlog
          const templatePackage_trim = (({ tableData, ...o }) => o)(templatePackage);
          CreateAuditLog(null, "Delete Template Package", "TemplatePackage", templatePackage._id, templatePackage_trim, {});
        }),
    }),
    [dispatch],
  );

  useEffect(() => {
    dispatch(getStatusesRequest());
    dispatch(getSubmissionPeriodsRequest());

    return () => {
      dispatch(TemplatePackagesStoreActions.RESET());
      dispatch(StatusesStore.actions.RESET());
      dispatch(SubmissionPeriodsStore.actions.RESET());
    };
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(templatePackages?.length || 1)
  }, [templatePackages])

  return (
    <div>
      <TemplatePackageHeader />
      <ErrorBanner title={"You cannot delete the selected template package since it was already published"} targetStore={selectTemplatePackagesStore}/>
      <MaterialTable
        key={readRowNum}
        columns={!!templatePackages ? columns : preColumns}
        data={!!templatePackages ? templatePackages : prePackages}
        editable={!!templatePackages ? editable : undefined}
        // @ts-ignore
        options={options}
        actions={!!templatePackages ? actions : undefined}
      />
    </div>
  );
};

export default TemplatePackages;
