import React, { ChangeEvent, ComponentProps, Dispatch, ReactNode, ReactPropTypes, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable, { Action, Column, Options } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, StyledProps, Theme } from '@material-ui/core/styles';
import ControlPoint from '@material-ui/icons/ControlPoint';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/Check';
import Box from '@material-ui/core/Box';
import CircularProgress, { CircularProgressProps } from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import './MasterValuePopulation.scss';
//@ts-ignore
import cloneDeep from 'clone-deep';
import axios from 'axios';
//@ts-ignore
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import MuiDialogTitle from '@material-ui/core/DialogTitle';
//@ts-ignore
import MuiDialogContent from '@material-ui/core/DialogContent';
//@ts-ignore
import MuiDialogActions from '@material-ui/core/DialogActions';
//@ts-ignore
import IconButton from '@material-ui/core/IconButton';
//@ts-ignore
import CloseIcon from '@material-ui/icons/Close';
import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
//@ts-ignore
} from '../../store/common/REST/selectors';
//@ts-ignore
import { selectOrgsStore } from '../../store/OrganizationsStore/selectors';
//@ts-ignore
import { selectCOAsStore } from '../../store/COAsStore/selectors';
//@ts-ignore
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
//@ts-ignore
import {selectDataResumeStore}from '../../store/DataResumeStore/selector';
//@ts-ignore
import Loading from '../../components/Loading';
//@ts-ignore
import {getDataResume,updateDataResume} from '../../store/thunks/DataResume';
//@ts-ignore
import { getColumnNamesRequest } from '../../store/thunks/columnName';
//@ts-ignore
import { getCOAsRequest } from '../../store/thunks/COA';
//@ts-ignore
import { getOrgsRequest } from '../../store/thunks/organization';
//@ts-ignore
import MasterValueModel from '../../../../backend/src/models/MasterValue';
//@ts-ignore
import MasterValueController from '../../controllers/MasterValue';

//@ts-ignore
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
//@ts-ignore
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';

//@ts-ignore
import DataResumeController from '../../controllers/DataResume'
//@ts-ignore
import OrganizationController from '../../controllers/organization';
//@ts-ignore
import COAController from '../../controllers/COA';
import { withStyles } from '@material-ui/core/styles';
//@ts-ignore
import Dialog from '@material-ui/core/Dialog';
//@ts-ignore
import MuiDialogTitle, { DialogTitleProps } from '@material-ui/core/DialogTitle';
//@ts-ignore
import MuiDialogContent from '@material-ui/core/DialogContent';
//@ts-ignore
import MuiDialogActions from '@material-ui/core/DialogActions';
//@ts-ignore
import IconButton from '@material-ui/core/IconButton';
//@ts-ignore
import CloseIcon from '@material-ui/icons/Close';
import Category from '../../types/category';
import Organization from '../../types/organization';
import Attribute from '../../types/attrubute';
import ReportingPeriod from '../../types/reportingperiod';
import DataResume from '../../types/dataresume';
import { createStyles, StyledComponentProps, Styles } from '@material-ui/styles';

interface MasterValue {
  attributeId: string,
  attributeName: string,
  categoryId: string,
  categoryName: string,
  org: {
    id: number,
    name: string,
  },
  reportingPeriod: string,
  template: string,
  // idk if this should be more specific
  value?: any,
}

interface PopulateParamters {
  category: Category[],
  ap: string,
  hfk: Organization[],
  col: Attribute[],
  currentCount: number,
  totalCount: number,
  resumeArray: MasterValue[],
}

interface QueryRESTParams {
  category: Category[],
  ap: string,
  hfk: Organization[],
  attribute: Attribute,
}

interface CheckableCategory extends Category {
  checked?: boolean,
  tableData?: any,
}

interface CheckableOrg extends Organization {
  checked?: boolean,
  tableData?: any,
}

interface headerActionsProps {
  val: string,
  data: string[],
  name: string,
  handleChange: (event: ChangeEvent<{name?: string, value: unknown}>) => void
}

type resultType = {
  data: [
    [number, string, number]
  ]
}

type dialogTitleProps = StyledComponentProps & {
  children: ReactNode,
  onClose: () => void,
  id?: string,
}




const REST_API = 'https://ohfsrest.azurewebsites.net';

const TABLES = ['FCLTY_BSA_YTD_ACTL_FORCST_DETL', 'FCLTY_SECDY_YTD_ACTL_FORCST_DT'];

const isBalanceSheet = (COA: string) => {
  if (!COA) {
    return 0
  }
  const BSA = ['1', '3', '4', '5', '6'];
  const idx = COA.indexOf('pa=');
  return idx != -1 && BSA.includes(COA[idx + 3]) ? 0 : 1;
};

const addDocument = async (masterValue: MasterValue) => {
  const newMasterValue = {
    categoryId: masterValue.categoryId,
    categoryName: masterValue.categoryName,
    attributeId: masterValue.attributeId,
    attributeName: masterValue.attributeName,
    org: {
      id: masterValue.org.id,
      name: masterValue.org.name,
    },
    reportingPeriod: masterValue.reportingPeriod,
    template: masterValue.template,
    value: masterValue.value,
  };
  await MasterValueController.addDocument(newMasterValue).then((_res: any) => {
    // setLoadCount(loadCount=>loadCount+1);
    console.log('add one successfully');  
  })
};
const queryREST = async (
    { category, ap, hfk, attribute }: QueryRESTParams,
    setGetCount: Dispatch<SetStateAction<number>>,
    setGetTotal: Dispatch<SetStateAction<number>>,
    getCount: number,
    getTotal: number,
    setResumeQueries: Dispatch<SetStateAction<MasterValue[]>>,
    resumeQueries: MasterValue[],
    setGetButtonDisabled: Dispatch<SetStateAction<boolean>>,
  ) => {
  if (!attribute) {
    return
  }
  const queries: string[] = [];

  const upsList = [];
  const ye = ap.split('/')[0];
  const year = ye.slice(2, 4);
  const stage = ap.slice(8, 10);
  setGetButtonDisabled(true);

  for (const c of category) {
    for (const h of hfk) {
      upsList.push({
        reportingPeriod: ap,
        template: 'OHFS',
        org: {
          id: h.id,
          name: h.name,
        },
        categoryId: c.id,
        categoryName: c.name,
        attributeId: attribute.id,
        attributeName: attribute.name,
      });
      const table = TABLES[isBalanceSheet(c.COA)];
      if (!c.COA || c.COA.length == 0) {
        queries.push(`${REST_API}/${table}/A_P=${`${year}${stage}`}&ORG_ID=-1&pa=2*`);
      } // temporary fix
      else {
        queries.push(`${REST_API}/${table}/A_P=${`${year}${stage}`}&ORG_ID=${h.id}&${c.COA}`);
      }
    }
  }
  const axiosConfig = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
  


  const addDocument = async (masterValue: MasterValue) => {
    const newMasterValue = {
      categoryId: masterValue.categoryId,
      categoryName: masterValue.categoryName,
      attributeId: masterValue.attributeId,
      attributeName: masterValue.attributeName,
      org: {
        id: masterValue.org.id,
        name: masterValue.org.name,
      },
      reportingPeriod: masterValue.reportingPeriod,
      template: masterValue.template,
      value: masterValue.value,
    };
    await MasterValueController.addDocument(newMasterValue).then((_res: any) => {
      // setLoadCount(loadCount=>loadCount+1);
      console.log('add one successfully');
    })
  };


  let failedQueries = [];
  let failedMasterValues = [];
  let results: (resultType | [])[] = [];
  let masterValueList: MasterValue[] = upsList;
  setGetTotal(queries.length);
  let progressCount = 0;
  for (let i = 0; i < queries.length; i++) {
    console.log(`Iteration ${i} start`);
    try {
      // if(i%20 == 0&& i!=0){
      //   throw `index ${i} can be divided by 20`;
      // }
      
      await axios.get(queries[i]).then((result)=>{
        results.push(result);
      });
    } catch (e) {
      console.log(e);
      console.log(`Get Iteration ${i} catch block, corresponding url is ${queries[i]}`);
      results.push([]);
      const failObject = masterValueList[i];
      failObject.value = [queries[i]];
      failedQueries.push(failObject);

      continue;
    }

    try {
      if (results[i] == []) {
        throw `Get Iteration ${i} has already failed, corresponding url is ${queries[i]}`;
      // I cast manually in elif because we know it's not []
      } else if ((results[i] as resultType).data.length > 0) {
        console.log(`index ${i} has data`)
        masterValueList[i].value = (results[i] as resultType).data[0][2];            
        await addDocument(masterValueList[i]);
      }
    } catch (e) {
      console.log(e);
      console.log(`Load Iteration ${i} catch block`);
      const failObject = masterValueList[i];
      failObject.value = [queries[i]];
      failedQueries.push(failObject);
      continue;
    }

    setGetCount(getCount => getCount + 1);
    progressCount += 1;
  }
  console.log(results);
  console.log(failedQueries);
  const dataResume = {
    resumeArray: failedQueries,
    currentCount: progressCount,
    totalCount: queries.length,
  };
  setResumeQueries(failedQueries);
  setGetButtonDisabled(false);
};

const DoRetrieval = (
    { category, ap, hfk, col }: PopulateParamters,
    setGetCount: Dispatch<SetStateAction<number>>,
    setGetTotal: Dispatch<SetStateAction<number>>,
    getCount: number,
    getTotal: number,
    setResumeQueries: Dispatch<SetStateAction<MasterValue[]>>,
    resumeQueries: MasterValue[],
    setGetSuccess: Dispatch<SetStateAction<boolean>>,
    setGetButtonDisabled: Dispatch<SetStateAction<boolean>>,
  ) => {
  setGetSuccess(false)
  if (category && ap && hfk && category.length > 0 && hfk.length > 0 && ap.length > 0) {
    // console.log(ap)
    // const period = ap.split(' ')[0];
    console.log(ap);
    let fnd = null;
    for (const elem of col) {
      if (elem.name === `${ap} Actual`) {
        fnd = elem;
        break;
      }
    }
    if (fnd) {
      queryREST(
        { category, ap, hfk, attribute: fnd },
        setGetCount,
        setGetTotal,
        getCount,
        getTotal,
        setResumeQueries,
        resumeQueries,
        setGetButtonDisabled,
      );
    } else alert("Attribute doesn't exist in database");
  } else alert('Missing one or more parameters.');
};
const  handleResume = async (
    setGetCount: Dispatch<SetStateAction<number>>,
    setGetTotal: Dispatch<SetStateAction<number>>,
    getCount: number,
    getTotal: number,
    setResumeQueries: Dispatch<SetStateAction<MasterValue[]>>,
    resumeQueries: MasterValue[],
    setResumeButtonDisabled: Dispatch<SetStateAction<boolean>>,
  )=>{
  console.log(resumeQueries)
  console.log(getCount,getTotal)
  setResumeButtonDisabled(true)
  let failedQueries = [];
  let results: (resultType | [])[] = [];
  
  
  for (let i = 0;i< resumeQueries.length; i++) {
    let resumeQuery = '';
    let org;
    let coa;
    console.log(`Iteration ${i} start`);
    try {
      console.log(resumeQueries[i].org.id);
      console.log(resumeQueries[i].categoryId);
      org = await OrganizationController.fetchById(resumeQueries[i].org.id);
      coa = await COAController.fetchCOAbyId(resumeQueries[i].categoryId);
      console.log(coa.COAs);
      // if target organization has been deleted
      if (org.organizations.length == 0) {
        setGetCount(getCount => getCount + 1);
        throw `Can not find corresponding org using this id: ${resumeQueries[i].org.id}`;
      }
      // if target category has been deleted
      if (coa.COAs.length == 0) {
        console.log('reach error part');
        setGetCount(getCount => getCount + 1);
        throw `Can not find corresponding coa using this id: ${resumeQueries[i].categoryId}`;
      }
      const idx = resumeQueries[i].value[0].indexOf('ID=');
      resumeQuery += resumeQueries[i].value[0].substring(0, idx + 3);
      // if COA is empty
      if (coa.COAs.COA.length == 0) {
        resumeQuery += '-1&pa=2*';
      } else {
        resumeQuery += org.organizations.id;
        resumeQuery += '&';
        resumeQuery += coa.COAs.COA;
      }
      console.log(resumeQuery);
      // console.log(resumeQueries[i].value[0])


      await axios.get(resumeQuery).then((result)=>{
        results.push(result)
      })
    } catch (e) {
      console.log(e);
      console.log(
        `Get Iteration ${i} catch block, corresponding url is ${resumeQueries[i].value[0]}`,
      );
      results.push([]);
      console.log(resumeQueries[i]);
      const failedMasterValue = cloneDeep(resumeQueries[i]);
      failedMasterValue.value = [resumeQuery];
      failedQueries.push(failedMasterValue);

      continue;
    }

    try{
      if (results[i] !== [] && (results[i] as resultType).data.length > 0) {
        console.log(`index ${i} has data`)
        const masterValue = cloneDeep(resumeQueries[i])
        masterValue.value = (results[i] as resultType).data[0][2];            
        await addDocument(masterValue);
      }
    } catch (e) {
      console.log(e);
      console.log(`Load Iteration ${i} catch block`);
      const failedMasterValue = cloneDeep(resumeQueries[i]);
      failedMasterValue.value = [resumeQuery];
      failedQueries.push(failedMasterValue);
      continue;
    }
    setGetCount(getCount => getCount + 1);
  }
  setResumeQueries(failedQueries);
  setResumeButtonDisabled(false);
}
const HeaderActions = (props: headerActionsProps) => {
  return (
    <Paper className="header">
      <Typography variant="h5">Prepopulate from OHFS</Typography>

      <Selection {...props} />
    </Paper>
  );
};
function CircularProgressWithLabel(props: CircularProgressProps) {
  return (
    <Box padding="0%" position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
          props.value || 0,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}




























































type footerActionProps = { getPopulateParameters: () => PopulateParamters }
const  FooterActions =  (props: footerActionProps) =>  {

  const [getCount, setGetCount] = useState<number>(props.getPopulateParameters().currentCount);
  const [getTotal, setGetTotal] = useState<number>(props.getPopulateParameters().totalCount);
  const [getSuccess, setGetSuccess] = useState(false);
  const [resumeQueries, setResumeQueries] = useState(props.getPopulateParameters().resumeArray);
  const [getButtonDisabled, setGetButtonDisabled] = useState(false);

  const [resumeButtonDisabled, setResumeButtonDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  
    const handleDialogOpen = (alertMessage: string, alertTitle: string) => {
      setAlertMessage(alertMessage);
      setAlertTitle(alertTitle)
      setOpen(true);
    };

  const handleDialogClose = () => {
    setAlertMessage('');
    setAlertTitle('');
    setOpen(false);
  };

  const dialogStyles = createStyles((theme: Theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  }));
  const DialogTitle = withStyles(dialogStyles)((props: dialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes?.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes?.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles(theme => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
  
  const  CustomizedDialogs = (props: { alertTitle: string, alertMessage: string }) => {
    
  
    return (
      <div>
        <Dialog onClose={handleDialogClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleDialogClose}>
            {props.alertTitle}
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>{props.alertMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDialogClose} color="primary">
              Close the dialog
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  React.useEffect(() => {
    if (getCount == getTotal && getCount > 0) {
      setGetSuccess(true);
    }
  }, [getCount]);
  useEffect(() => {
    console.log('upload to database');
    console.log(getCount);
    console.log(getTotal);
    if (!(getCount == 0 && getTotal == 0)) {
      if (getCount == getTotal) {
        console.log('finish');
        setGetCount(0);
        setGetTotal(0);
        setResumeQueries([]);
        const dataResumeStatues = { resumeArray: [], currentCount: 0, totalCount: 0 };
        dispatch(updateDataResume(dataResumeStatues));
        setTimeout(function () {
          handleDialogOpen('finish progress successfully!', 'Result');
        }, 500);
      } else {
        let alertMessage = '';
        console.log('some cases failed');
        console.log(resumeQueries);
        for (let i = 0; i < resumeQueries.length; i++) {
          alertMessage += 'organization id : ';
          alertMessage += resumeQueries[i].org.id;
          alertMessage += ' ';
          alertMessage += ', category id : ';
          alertMessage += resumeQueries[i].categoryId;
          alertMessage += '\n';
          // alertMessage += ' url : '
          alertMessage += resumeQueries[i].value[0];
          alertMessage += '\n';
        }
        const dataResumeStatues = {
          resumeArray: resumeQueries,
          currentCount: getCount,
          totalCount: getTotal,
        };

        dispatch(updateDataResume(dataResumeStatues));

        handleDialogOpen(alertMessage, 'Some queries failed, they are :');
      }
    }
  }, [resumeQueries]);
  return (
    <Paper className="footer">
      <div className="bottomEle">
        <Button
          disabled={getButtonDisabled}
          color="primary"
          variant="contained"
          size="large"
          onClick={() =>
            DoRetrieval(
              props.getPopulateParameters(),
              setGetCount,
              setGetTotal,
              getCount,
              getTotal,
              setResumeQueries,
              resumeQueries,
              setGetSuccess,
              setGetButtonDisabled,
            )
          }
        >
          Get Actuals from OHFS
        </Button>
      </div>
      <div className="bottomEle">
        <Button
          disabled={getButtonDisabled || resumeButtonDisabled}
          color="primary"
          variant="contained"
          size="large"
          onClick={() =>
            handleResume(
              setGetCount,
              setGetTotal,
              getCount,
              getTotal,
              setResumeQueries,
              resumeQueries,
              setResumeButtonDisabled,
            )
          }
        >
          Resume the progress
        </Button>
      </div>
      <div className="bottomEle">Get From OHFS</div>
      {getSuccess ? (
        <CheckIcon fontSize="large" />
      ) : (
        <CircularProgressWithLabel value={getTotal == 0 ? 0 : (getCount / getTotal) * 100} />
      )}
      <CustomizedDialogs alertMessage={alertMessage} alertTitle={alertTitle} />
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  scrollTable: {
    height: 500,
    width: '100%',
    overflowY: 'auto',
  },
}));

const Selection = ({ val, data, name, handleChange }: headerActionsProps) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={name}>{name}</InputLabel>
      <Select labelId="label" value={val} onChange={handleChange} name={name}>
        {data.map(dat => (
          <MenuItem key={dat} value={dat}>
            {dat}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const MasterValuePopulation = () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  useEffect(() => {
    dispatch(getOrgsRequest());
    dispatch(getCOAsRequest());
    dispatch(getColumnNamesRequest());
    dispatch(getReportingPeriodsRequest());
    dispatch(getDataResume());
  }, [dispatch, localStorage.getItem('dataLoadingFeedback')]);

  const {
    db_categoryList,
    db_hfkList,
    db_columnNamesList,
    reportingPeriods,
    dataResumeStatues,
    isCallInProgress,
  }: {
    db_categoryList: Category[],
    db_hfkList: Organization[],
    db_columnNamesList: Attribute[],
    reportingPeriods: ReportingPeriod[],
    dataResumeStatues: DataResume[],
    isCallInProgress: boolean,
  } = useSelector(state => ({
    db_categoryList: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    db_hfkList: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
    db_columnNamesList: selectFactoryRESTResponseTableValues(selectColumnNamesStore)(state),
    reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    dataResumeStatues: selectFactoryRESTResponseTableValues(selectDataResumeStore)(state),
    isCallInProgress:
      selectFactoryRESTIsCallInProgress(selectCOAsStore)(state) ||
      selectFactoryRESTIsCallInProgress(selectOrgsStore)(state) ||
      selectFactoryRESTIsCallInProgress(selectColumnNamesStore)(state) ||
      false,
  }));

  console.log('why not:', {
    db_categoryList,
    db_hfkList,
    db_columnNamesList,
    reportingPeriods,
    dataResumeStatues,
    isCallInProgress,
  });

  

  const periodList: string[] = [];
  reportingPeriods.forEach(period => {
    periodList.push(period.name);
  });
  periodList.sort().reverse();

  const [categoryList, updateCategoryList] = useState<CheckableCategory[]>([]);
  const [userFeedBack, setUserFeedBack] = useState('');
  const [hfkList, updateHfkList] = useState<CheckableOrg[]>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [resumeArray, setResumeArray] = useState<MasterValue[]>([]);

  useEffect(() => {
    console.log('dataResumeStatues', dataResumeStatues);
    if (dataResumeStatues.length != 0) {
      setCurrentCount(dataResumeStatues[0].currentCount);
      setTotalCount(dataResumeStatues[0].totalCount);
      setResumeArray(dataResumeStatues[0].resumeArray);
    }
  }, [dataResumeStatues]);
  useEffect(() => {
    // console.log('db_categoryList changes', db_categoryList)
    updateCategoryList(() => db_categoryList.map(item => ({ ...item, checked: false })));
  }, [db_categoryList]);

  useEffect(() => {
    updateHfkList(() =>
      db_hfkList
        .filter(org => org.active)
        .sort((a, b) => a.id - b.id)
        .map(org => ({ ...org, checked: false })),
    );
  }, [db_hfkList]);

  const [query, setQuery] = useState({
    year: '',
  });

  const handleChange = (event: ChangeEvent<{ name?: string, value: unknown }>) => {
    const { name } = event.target;
    setQuery(qu => ({ ...qu, [name || '']: event.target.value }));
  };

  const hfk_columns: Column<Organization>[] = useMemo(
    () => [
      { title: '✓', type: 'boolean', field: 'checked' },
      { title: 'ID', field: 'id' },
      { title: 'Name', field: 'name' },
    ],
    [],
  );

  const category_columns: Column<CheckableCategory>[] = useMemo(() => [
    { title: '✓', type: 'boolean', field: 'checked' },
    { title: 'ID', field: 'id' },
    { title: 'Name', field: 'name' },
  ], []);

  const options: Options<CheckableCategory | CheckableOrg> = useMemo(
    () => ({
      actionsColumnIndex: -1,
      search: true,
      maxBodyHeight: 400,
      minBodyHeight: 400,
    }),
    [],
  );

  const [hfkState, updateHfkState] = useState(false);

  const hfk_actions: Action<CheckableOrg>[] = useMemo(
    () => [
      {
        icon: ControlPoint,
        tooltip: 'Toggle',
        onClick: (_: any, obj: CheckableOrg | CheckableOrg[]) => {
          if (Array.isArray(obj)) {
            return
          }
          updateHfkList(list =>
            list.map(hfk => {
              if (hfk !== obj) return hfk;
              return { ...hfk, checked: !hfk.checked };
            }),
          );
        },
      },
      {
        icon: AddCircleIcon,
        tooltip: 'Toggle All',
        position: 'toolbar',
        onClick: (_: any, _obj: CheckableOrg | CheckableOrg[]) => {
          // very sketchy fix, not sure why hfkState isn't updating outside of updateHfkState...
          updateHfkState(state => {
            updateHfkList(list => list.map(hfk => ({ ...hfk, checked: !state })));
            return !state;
          });
        },
      },
    ],
    [],
  );

  const [categoryState, updateCategoryState] = useState(false);

  const category_actions: Action<CheckableCategory>[] = useMemo(() => [
    {
      icon: ControlPoint,
      tooltip: 'Toggle',
      onClick: (_: any, obj: CheckableCategory | CheckableCategory[]) => {
        updateCategoryList(list =>
          list.map(category => {
            if (category !== obj) return category;
            return { ...category, checked: !category.checked };
          }),
        );
      },
    },
    {
      icon: AddCircleIcon,
      tooltip: 'Toggle All',
      position: 'toolbar',
      onClick: (_: any, _obj: CheckableCategory | CheckableCategory[]) => {
        updateCategoryList(list =>
          list.map(category => ({ ...category, checked: !categoryState })),
        );
        updateCategoryState(state => !state);
      },
    },
  ], []);

  const getPopulateParameters = (): PopulateParamters => {
    const category = categoryList.filter(obj => obj.checked).map(obj => ({ ...obj }));
    category.forEach(obj => {
      delete obj.checked;
      delete obj.tableData;
    });
    const ap = query.year;
    const hfk = hfkList.filter(obj => obj.checked).map(obj => ({ ...obj }));
    hfk.forEach(obj => {
      delete obj.checked;
      delete obj.tableData;
    });
    return {
      category,
      ap,
      hfk,
      col: db_columnNamesList,
      currentCount,
      totalCount,
      resumeArray,
    };
  };

  return isCallInProgress ? (
    //@ts-ignore
    <Loading />
  ) : (
    <div>
      <HeaderActions val={query.year} data={periodList} name={'year'} handleChange={handleChange} />
      <div className="tableContainer">
        <div className="tableWrapper">
          <MaterialTable
            // className not supported yet
            style={{
              height: '500',
              width: '100%',
              overflowY: 'auto',
            }}
            title={'Organizations'}
            columns={hfk_columns}
            data={hfkList}
            options={(options as Options<CheckableOrg>)}
            actions={hfk_actions}
          />
        </div>
        <div className="tableWrapper">
          <MaterialTable
            style={{
              height: '500',
              width: '100%',
              overflowY: 'auto',
            }}
            title={'Categories'}
            columns={category_columns}
            data={categoryList}
            options={(options as Options<CheckableCategory>)}
            actions={category_actions}
          />
        </div>
      </div>
      <div className="divider"> </div>
      <FooterActions getPopulateParameters={getPopulateParameters} />
      <div></div>
    </div>
  );
};

export default MasterValuePopulation;
