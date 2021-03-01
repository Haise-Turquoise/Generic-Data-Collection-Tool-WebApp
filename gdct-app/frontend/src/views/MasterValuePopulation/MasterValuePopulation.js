import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import MaterialTable from 'material-table';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ControlPoint from '@material-ui/icons/ControlPoint';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/Check';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import './MasterValuePopulation.scss';
import cloneDeep from 'clone-deep';
import axios from 'axios';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
} from '../../store/common/REST/selectors';
import { selectOrgsStore } from '../../store/OrganizationsStore/selectors';
import { selectCOAsStore } from '../../store/COAsStore/selectors';
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
import {selectDataResumeStore}from '../../store/DataResumeStore/selector';
import Loading from '../../components/Loading';
import {getDataResume,updateDataResume} from '../../store/thunks/DataResume';
import { getColumnNamesRequest } from '../../store/thunks/columnName';
import { getCOAsRequest } from '../../store/thunks/COA';
import { getOrgsRequest } from '../../store/thunks/organization';
import MasterValueModel from '../../../../backend/src/models/MasterValue';
import MasterValueController from '../../controllers/MasterValue';

import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';

import DataResumeController from '../../controllers/DataResume'
import OrganizationController from '../../controllers/organization';
import COAController from '../../controllers/COA';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';




const REST_API = 'https://ohfsrest.azurewebsites.net';

const TABLES = ['FCLTY_BSA_YTD_ACTL_FORCST_DETL', 'FCLTY_SECDY_YTD_ACTL_FORCST_DT'];

const isBalanceSheet = COA => {
  const BSA = ['1', '3', '4', '5', '6'];
  const idx = COA.indexOf('pa=');
  return idx != -1 && BSA.includes(COA[idx + 3]) ? 0 : 1;
};
const addDocument = async masterValue => {
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
  await MasterValueController.addDocument(newMasterValue).then(res => {
    // setLoadCount(loadCount=>loadCount+1);
    
    console.log('add one successfully');
    
  })
};
const queryREST = async ({ category, ap, hfk, attribute },setGetCount, setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setGetButtonDisabled) => {
  const queries = [];

  const upsList = [];
  const ye = ap.split('/')[0];
  const year = ye.slice(2, 4);
  const stage = ap.slice(8, 10);
  setGetButtonDisabled(true)

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
      if (c.COA.length == 0) {
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
  



  const addDocument = async masterValue => {
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
    await MasterValueController.addDocument(newMasterValue).then(res => {
      // setLoadCount(loadCount=>loadCount+1);
      
      console.log('add one successfully');
      
    })
  };


  let failedQueries = [];
  let failedMasterValues = [];
  let results = [];
  let masterValueList = upsList;
  setGetTotal(queries.length);
  let progressCount = 0;
  for (let i = 0;i< queries.length; i++) {
    console.log(`Iteration ${i} start`);
    try {
      
      // if(i%20 == 0&& i!=0){
      //   throw `index ${i} can be divided by 20`;
      // }
      
      await axios.get(queries[i]).then((result)=>{    
        results.push(result);
      })
    } catch (e) {
      console.log(e)
      console.log(`Get Iteration ${i} catch block, corresponding url is ${queries[i]}`);
      results.push([]);
      const failObject = masterValueList[i];
      failObject.value = [queries[i]];
      failedQueries.push(failObject)
      
      continue;
    }

    try{
      if(results[i] ==[]){
        throw `Get Iteration ${i} has already failed, corresponding url is ${queries[i]}`;
      }
      else if (results[i].data.length > 0) {
        console.log(`index ${i} has data`)      
        masterValueList[i].value = results[i].data[0][2];            
        await addDocument(masterValueList[i]);
        
      }
    } catch (e) {
      console.log(e)
      console.log(`Load Iteration ${i} catch block`);
      const failObject = masterValueList[i];
      failObject.value = [queries[i]];
      failedQueries.push(failObject);
      continue;
    }

    setGetCount(getCount=>getCount+1);
    progressCount +=1;
    
    
  }
  console.log(results);
  console.log(failedQueries);
  const dataResume = {resumeArray:failedQueries, currentCount:progressCount, totalCount:queries.length}
  setResumeQueries(failedQueries)
  setGetButtonDisabled(false)
};

const DoRetrieval = ({ category, ap, hfk, col },setGetCount, setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setGetSuccess,setGetButtonDisabled) => {
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
      queryREST({ category, ap, hfk, attribute: fnd },setGetCount, setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setGetButtonDisabled);
    } else alert("Attribute doesn't exist in database");
  } else alert('Missing one or more parameters.');
};
const  handleResume = async (setGetCount,setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setResumeButtonDisabled)=>{
  console.log(resumeQueries)
  console.log(getCount,getTotal)
  setResumeButtonDisabled(true)
  let failedQueries = [];
  let results = [];
  
  
  for (let i = 0;i< resumeQueries.length; i++) {
    let resumeQuery = '';
    let org = undefined;
    let coa = undefined;
    console.log(`Iteration ${i} start`);
    try {

      
      console.log(resumeQueries[i].org.id)
      console.log(resumeQueries[i].categoryId)
      org = await OrganizationController.fetchById(resumeQueries[i].org.id)
      coa = await COAController.fetchCOAbyId(resumeQueries[i].categoryId)
      console.log(coa.COAs)
      // if target organization has been deleted
      if(org.organizations.length == 0){
        setGetCount(getCount=>getCount+1);
        throw `Can not find corresponding org using this id: ${resumeQueries[i].org.id}` 
      }
      // if target category has been deleted
      if(coa.COAs.length == 0){
        console.log('reach error part')
        setGetCount(getCount=>getCount+1);
        throw `Can not find corresponding coa using this id: ${resumeQueries[i].categoryId}` 
      }
      const idx = resumeQueries[i].value[0].indexOf('ID=');
      resumeQuery += resumeQueries[i].value[0].substring(0,idx+3);
      // if COA is empty
      if(coa.COAs.COA.length == 0){
        resumeQuery += '-1&pa=2*'
      }
      else{
        resumeQuery += org.organizations.id;
        resumeQuery += '&';
        resumeQuery += coa.COAs.COA;
      }
      console.log(resumeQuery)
      // console.log(resumeQueries[i].value[0])


      await axios.get(resumeQuery).then((result)=>{ 
        
        results.push(result)
      })
    } catch (e) {
      console.log(e)
      console.log(`Get Iteration ${i} catch block, corresponding url is ${resumeQueries[i].value[0]}`);
      results.push([])
      console.log(resumeQueries[i])
      const failedMasterValue = cloneDeep(resumeQueries[i])
      failedMasterValue.value = [resumeQuery]
      failedQueries.push(failedMasterValue)
      
      continue;
    }

    try{
      // console.log(results);
      if (results[i].data.length > 0) {
        console.log(`index ${i} has data`)
        const masterValue = cloneDeep(resumeQueries[i])      
        masterValue.value = results[i].data[0][2];            
        await addDocument(masterValue);
        
      }
    } catch (e) {
      console.log(e)
      console.log(`Load Iteration ${i} catch block`);
      const failedMasterValue = cloneDeep(resumeQueries[i])
      failedMasterValue.value = [resumeQuery]
      failedQueries.push(failedMasterValue)
      continue;
    }
    setGetCount(getCount=>getCount+1);
    
  }
  setResumeQueries(failedQueries);
  setResumeButtonDisabled(false);
}
const HeaderActions = props => {
  return (
    <Paper className="header">
      <Typography variant="h5">Prepopulate from OHFS</Typography>
      
      <Selection {...props} />
      
    </Paper>
  );
};
function CircularProgressWithLabel(props) {
  return (
    <Box padding = "0%" position="relative" display="inline-flex">
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
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}





























































const  FooterActions =  props =>  {

  const [getCount, setGetCount] = useState(props.getPopulateParameters().currentCount);
  const [getTotal, setGetTotal] = useState(props.getPopulateParameters().totalCount);
  const [getSuccess, setGetSuccess] = useState(false);
  const [resumeQueries,setResumeQueries] = useState(props.getPopulateParameters().resumeArray);
  const [getButtonDisabled,setGetButtonDisabled] = useState(false);
  
  const [resumeButtonDisabled,setResumeButtonDisabled] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  
    const handleDialogOpen = (alertMessage,alertTitle) => {
      setAlertMessage(alertMessage);
      setAlertTitle(alertTitle)
      setOpen(true);
    };
    const handleDialogClose = () => {
      setAlertMessage('');
      setAlertTitle('')
      setOpen(false);
  };







  const dialogStyles = (theme) => ({
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
  });
  
  const DialogTitle = withStyles(dialogStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
  
  const  CustomizedDialogs = props=> {
    
  
    return (
      <div>
        
        <Dialog onClose={handleDialogClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleDialogClose}>
            {props.alertTitle}
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              {props.alertMessage}
            </Typography>
            
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleDialogClose} color="primary">
              Close the dialog
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }




















  React.useEffect(() => {
    if(getCount == getTotal && getCount>0){
      setGetSuccess(true)
    }
  }, [getCount]);
  useEffect(()=>{
    console.log('upload to database')
    console.log(getCount)
    console.log(getTotal)
    if(!(getCount == 0 && getTotal == 0)){
      
      if(getCount == getTotal){
        console.log('finish')
        setGetCount(0);
        setGetTotal(0);
        setResumeQueries([])
        const dataResumeStatues = {resumeArray:[], currentCount:0, totalCount:0}
        dispatch(updateDataResume(dataResumeStatues));
        setTimeout(function(){ handleDialogOpen('finish progress successfully!','Result'); }, 500);
        
      }
      else{
        let alertMessage = ""
        console.log('some cases failed')
        console.log(resumeQueries);
        for (let i = 0;i< resumeQueries.length; i++) {
          alertMessage += 'organization id : '
          alertMessage += resumeQueries[i].org.id
          alertMessage += ' ';
          alertMessage += ', category id : ';
          alertMessage += resumeQueries[i].categoryId;
          alertMessage += '\n'
          // alertMessage += ' url : '
          alertMessage += resumeQueries[i].value[0];
          alertMessage += '\n';
        }
        const dataResumeStatues = {resumeArray:resumeQueries, currentCount:getCount, totalCount:getTotal}
        
        dispatch(updateDataResume(dataResumeStatues));
        
        handleDialogOpen(alertMessage,'Some queries failed, they are :');
      }
      
    }  
  },[resumeQueries])
  return (
    
    <Paper className="footer">
      <div className = "bottomEle">
        <Button
          
          disabled={getButtonDisabled}
          color="primary"
          variant="contained"
          size="large"
          onClick={() => DoRetrieval(props.getPopulateParameters(),setGetCount,setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setGetSuccess,setGetButtonDisabled)}
        >
          Get Actuals from OHFS
        </Button>
        
        
      </div>
      <div className = "bottomEle">
        <Button
          
          disabled={getButtonDisabled||resumeButtonDisabled}
          color="primary"
          variant="contained"
          size="large"
          onClick={() => handleResume(setGetCount,setGetTotal,getCount,getTotal,setResumeQueries,resumeQueries,setResumeButtonDisabled)}
        >
          Resume the progress
        </Button>
        
        
      </div>
      <div className = "bottomEle">Get From OHFS</div>
      {getSuccess?<CheckIcon fontSize="large"/>:<CircularProgressWithLabel value={(getTotal == 0)?0:(getCount/getTotal*100)} />}
      <CustomizedDialogs alertMessage = {alertMessage} alertTitle = {alertTitle}/>
      
      
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

const Selection = ({ val, data, name, handleChange }) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel name={name}>{name}</InputLabel>
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
  } = useSelector(state => ({
    db_categoryList: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    db_hfkList: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
    db_columnNamesList: selectFactoryRESTResponseTableValues(selectColumnNamesStore)(state),
    reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
    dataResumeStatues:selectFactoryRESTResponseTableValues(selectDataResumeStore)(state),
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

  

  const periodList = [];
  reportingPeriods.forEach(period => {
    periodList.push(period.name);
  });
  periodList.sort().reverse();

  const [categoryList, updateCategoryList] = useState([]);
  const [userFeedBack, setUserFeedBack] = useState('');
  const [hfkList, updateHfkList] = useState([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [resumeArray, setResumeArray] = useState([]);

  useEffect(() => {
    console.log('dataResumeStatues', dataResumeStatues)
    if(dataResumeStatues.length !=0){
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
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
        .map(org => ({ ...org, checked: false })),
    );
  }, [db_hfkList]);

  const [query, setQuery] = useState({
    year: '',
  });

  const handleChange = event => {
    const { name } = event.target;
    setQuery(qu => ({ ...qu, [name]: event.target.value }));
  };

  const hfk_columns = useMemo(
    () => [
      { title: '✓', type: 'boolean', field: 'checked' },
      { title: 'ID', field: 'id' },
      { title: 'Name', field: 'name' },
    ],
    [],
  );

  const category_columns = useMemo(() => [
    { title: '✓', type: 'boolean', field: 'checked' },
    { title: 'ID', field: 'id' },
    { title: 'Name', field: 'name' },
  ]);

  const options = useMemo(
    () => ({
      actionsColumnIndex: -1,
      search: true,
      maxBodyHeight:400,
      minBodyHeight:400,
    }),
    [],
  );

  const [hfkState, updateHfkState] = useState(false);

  const hfk_actions = useMemo(
    () => [
      {
        icon: ControlPoint,
        tooltip: 'Toggle',
        onClick: (_event, obj) => {
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
        onClick: _event => {
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

  const category_actions = useMemo(() => [
    {
      icon: ControlPoint,
      tooltip: 'Toggle',
      onClick: (_event, obj) => {
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
      onClick: _event => {
        updateCategoryList(list =>
          list.map(category => ({ ...category, checked: !categoryState })),
        );
        updateCategoryState(state => !state);
      },
    },
  ]);

  const getPopulateParameters = () => {
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
    <Loading />
  ) : (
    <div>
      <HeaderActions val={query.year} data={periodList} name={'year'} handleChange={handleChange} />
      <div className="tableContainer">
        <div className="tableWrapper">
          <MaterialTable
            className={classes.scrollTable}
            title={'Organizations'}
            columns={hfk_columns}
            data={hfkList}
            options={options}
            actions={hfk_actions}
          />
        </div>
        <div className="tableWrapper">
          <MaterialTable
            className={classes.scrollTable}
            title={'Categories'}
            columns={category_columns}
            data={categoryList}
            options={options}
            actions={category_actions}
          />
        </div>
      </div>
      <div className = "divider"> </div>
      <FooterActions getPopulateParameters={getPopulateParameters} />
      <div></div>
    </div>
  );
};

export default MasterValuePopulation;
