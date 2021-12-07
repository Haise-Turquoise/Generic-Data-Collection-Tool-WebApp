import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Paper, Typography } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { DatePicker } from '@material-ui/pickers'

import MaterialTable, { Action, Column, Options } from 'material-table';
import moment from 'moment';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { useHistory } from 'react-router-dom';
//@ts-ignore
import Select from 'react-select';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
  selectFactoryRESTLookup,
} from '../../store/common/REST/selectors';
import { selectTemplatePackagesStore } from '../../store/TemplatePackagesStore/selectors';
import { ROUTE_TEMPLATE_PCKGS_PCKGS } from '../../constants/routes';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
import { getStatusesRequest } from '../../store/thunks/status';
import { selectSubmissionPeriodsStore } from '../../store/SubmissionPeriodsStore/selectors';
import { getSubmissionPeriodsRequest } from '../../store/thunks/submissionPeriod';
import StatusesStore from '../../store/StatusesStore/store';
import SubmissionPeriodsStore from '../../store/SubmissionPeriodsStore/store';
import ErrorBanner from '../ErrorBanner';
import { calculateOptions, controllerAddRow, controllerEditRow, controllerDeleteRow, formatTimestamp, fetchWithStatus, checkDuplicates } from '../../tools/misc';
import CreateAuditLog from '../AuditLog_Global';
import templatePackageController from '../../controllers/templatePackage';


import TemplatePackage from '../../types/templatepackage';
import Status from '../../types/status';
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


interface TemplatePackageMT extends TemplatePackage {
  tableData?: any,
}

const controllerUpdateDeadline = async (id: string, date: any) =>{
  try{
    const res = await templatePackageController.updateDeadline(id, date);
    if (res.status !== 200) {
      return false
    }
    console.log("sucessfull");
    return true; 
  }catch(e){
    console.log("error occured for updating deadline")
    return false
  }
}

const formatedTimestamp = (d: Date,time:string)=> {
  
  var date = d.toISOString().split('T')[0];
  
  return `${date} ${time}`
}

const CostumeDatePicker = (props: any) =>{
  console.log("props ! !");
  console.log(props)
  var checkDealine = null;
  if(props.rowData.deadline != undefined){
    checkDealine = props.rowData.deadline;
  }
  const [date, setDate] = useState<Date | null>(checkDealine);


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
       <DatePicker
        format='yyyy-MM-dd 23:59:59'
        value={date}
        onChange = {(newDate) => {
          setDate(newDate)
          props.onChange(newDate)
        }
          
        }
        inputProps={{
          style: {
            fontSize: 14,
        }
        }}
      />
    </MuiPickersUtilsProvider>
    
  );
}

const TemplatePackageHeader = () => {
  return (
    <Paper className="header">
      <Typography variant="h5">Template Package</Typography>
    </Paper>
  );
};

const TemplatePackages = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [readRowNum, setRowNum] = useState(1);
  const [templatePackages, setTemplatePackages] = 
    useState<TemplatePackage[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<TemplatePackage>(templatePackageController, setTemplatePackages, setStatus)
    console.log(templatePackages);
  }, [])

  // table vars while loading
  const preColumns: Column<TemplatePackageMT>[] = [{ title: 'Name', field: 'name' }]
  const prePackages: TemplatePackageMT[] = [{
    name: status,
    _id: '',
    creationDate: '',
    programIds: [],
    statusId: '',
    submissionPeriodId: '',
    templateIds: [],
    updatedAt: '',
    updatedBy: '',
    deadline: '',
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
    templatePackage.updatedAt = formatTimestamp(templatePackage.updatedAt);
    templatePackage.creationDate = formatTimestamp(templatePackage.creationDate);
  });

  console.log(templatePackages);

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
      { title: 'Name', field: 'name', validate: rowData => checkDuplicates(rowData, templatePackages, 'name') },
      {
        title: 'Submission Period ID',
        field: 'submissionPeriodId',
        lookup: lookupSubmissionPeriods,
      },
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
                onChange={(data:any) => {
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
              onChange={(data:any) => {
                props.onChange(data?.value);
              }}
              options={optionListForPackage}
            />
          );

          // return <Select  options={optionList}/>
        },
      },
      {
        title: 'Creation Date',
        field: 'creationDate',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Modified On',
        field: 'updatedAt',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: "Close Date",
        field: "deadline",
        type: "date",
        render: (row) => <div>{row.deadline ? formatedTimestamp(new Date(row.deadline),"23:59:59") : ''}</div>,
        editComponent: (props) => {
          return <div><CostumeDatePicker {...props}/></div>;
        }
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [lookupStatuses, lookupSubmissionPeriods, templatePackages],
  );

  const options: Options<TemplatePackageMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs 
  function recordUpdate(templatePackage: TemplatePackageMT) {
    templatePackage.updatedBy = localStorage.getItem('currentUser') || '';
    templatePackage.updatedAt = new Date().toLocaleString(); 
  }
  // Prepare the editing functionalities for the material table
  const editable = useMemo(
    () => ({
      onRowAdd: (templatePackage: TemplatePackageMT) =>
        new Promise<TemplatePackage | undefined>((resolve, reject) => {
          
          recordUpdate(templatePackage);
          templatePackage = { ...templatePackage, templateIds: [], programIds: [] };
          templatePackage.creationDate = moment().format();
          console.log("XD");
          console.log(templatePackage);
          controllerAddRow(templatePackageController, setTemplatePackages, templatePackage)
            .then((res?: TemplatePackage) => {
            if (res) {
              resolve(res)
            }
            reject()
          })
        }).then(newTemplatePackage => {
          // For Auditlog
          if (newTemplatePackage) {
            CreateAuditLog(
              null,
              "Create Template Package",
              "TemplatePackage",
              newTemplatePackage._id,
              {},
              newTemplatePackage
            );
          }
        }),

      onRowUpdate: (templatePackage: TemplatePackageMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templatePackage);
          // Find the old value before updating in order to Auditlog
          (async () => {
            const oldTemplatePackage = await templatePackageController.fetchTemplatePackage(
              templatePackage._id,
            );
            CreateAuditLog(
              null,
              'Update Template Package',
              'TemplatePackage',
              oldTemplatePackage?._id,
              oldTemplatePackage,
              templatePackage,
            );
          })();
          // Do Update
          
          controllerEditRow(templatePackageController, setTemplatePackages, templatePackage).then((res: boolean) => {
            if (res) {
              resolve(templatePackage)
            }
            reject()
          })
        }),
        
      onRowDelete: (templatePackage: TemplatePackageMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(templatePackage);
          controllerDeleteRow(templatePackageController, setTemplatePackages, templatePackage._id).then((res: boolean) => {
            if (res) {
              resolve(res)
            }
            else{

              Swal.fire({
                title: 'Warning!',
                text:
                  'This package is published, it cannot be removed',
                icon: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              }).then((result:SweetAlertResult<any>) => {
                if (result.isConfirmed) {
                  window.location.reload();
                }
              });
            }
            reject()
          })
          // For Auditlog
          const templatePackage_trim = (({ tableData, ...o }) => o)(templatePackage);
          CreateAuditLog(
            null,
            'Delete Template Package',
            'TemplatePackage',
            templatePackage._id,
            templatePackage_trim,
            {},
          );
        }),
    }),
    [],
  );

  useEffect(() => {
    dispatch(getStatusesRequest());
    dispatch(getSubmissionPeriodsRequest());

    return () => {
      dispatch(StatusesStore.actions.RESET(''));
      dispatch(SubmissionPeriodsStore.actions.RESET(''));
    };
  }, [dispatch]);

  useEffect(()=>{
    setRowNum(templatePackages?.length || 1)
  }, [templatePackages])

  return (
    <div>
      <TemplatePackageHeader />
      <ErrorBanner
        title={'You cannot delete the selected template package since it was already published'}
        targetStore={selectTemplatePackagesStore}
      />
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
