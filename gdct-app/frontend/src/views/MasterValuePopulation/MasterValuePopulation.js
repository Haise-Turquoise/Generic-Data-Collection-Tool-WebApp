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

import Typography from '@material-ui/core/Typography';
import './MasterValuePopulation.scss';

import axios from 'axios';

import {
  selectFactoryRESTResponseTableValues,
  selectFactoryRESTIsCallInProgress,
} from '../../store/common/REST/selectors';
import { selectOrgsStore } from '../../store/OrganizationsStore/selectors';
import { selectCOAsStore } from '../../store/COAsStore/selectors';
import { selectColumnNamesStore } from '../../store/ColumnNamesStore/selectors';
import Loading from '../../components/Loading';

import { getColumnNamesRequest } from '../../store/thunks/columnName';
import { getCOAsRequest } from '../../store/thunks/COA';
import { getOrgsRequest } from '../../store/thunks/organization';
import MasterValueModel from '../../../../backend/src/models/MasterValue';
import MasterValueController from '../../controllers/MasterValue';
import { selectReportingPeriodsStore } from '../../store/ReportingPeriodsStore/selectors';
import { getReportingPeriodsRequest } from '../../store/thunks/reportingPeriod';
// const REST_API = 'https://hscgiqdcapwsa05/webohfs/faces';
// const REST_API = 'https://ohfsrestservice.azurewebsites.net';
const REST_API = 'https://ohfsrest.azurewebsites.net';
const TABLES = ['FCLTY_BSA_YTD_ACTL_FORCST_DETL', 'FCLTY_SECDY_YTD_ACTL_FORCST_DT'];

const isBalanceSheet = COA => {
  const BSA = ['1', '3', '4', '5', '6'];
  const idx = COA.indexOf('pa=');
  return idx != -1 && BSA.includes(COA[idx + 3]) ? 0 : 1;
};

const queryREST = ({ category, ap, hfk, attribute }) => {
  const queries = [];
  const upsList = [];
  const ye = ap.split('/')[0];
  const year = ye.slice(2, 4);
  const stage = ap.slice(8, 10);
  // console.log(year)
  // console.log(stage)
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

  const results = queries.map(query => {
    // const config = {
    //   method: 'get',
    //   url: query,
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    //   },
    // };
    return axios.get(query);
  });
  console.log(queries);
  const addDocument = masterValue => {
    // return MasterValueModel.findOne({
    //   CategoryId: mastervalue.CategoryId,
    //   AttributeId: mastervalue.AttributeId,
    //   org: {
    //     id: mastervalue.org.id,
    //     name: mastervalue.org.name,
    //   },
    // }).then(res => {

    //   if (res) {console.log('find');return MasterValueModel.findByIdAndUpdate(res._id, mastervalue);}
    //   else {console.log('not find');return MasterValueModel.create(mastervalue);}
    // }).catch((error) => {
    //   console.log(error);
    // });;
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
    MasterValueController.addDocument(newMasterValue).then(res => {
      console.log('hello');
    });
  };

  Promise.all(results)
    .then(res => {
      // console.log(upsList)
      const masterValueList = upsList;
      // console.log('res', res[0]);
      const upd = [];
      const idx = 0;
      for (const idx in res) {
        // console.log(res[idx].data)
        // console.log(masterValueList[idx])
        if (res[idx].data.length > 0) {
          // console.log(res[idx].data)
          masterValueList[idx].value = res[idx].data[0][2];
          // console.log(masterValueList[idx])
          upd.push(addDocument(masterValueList[idx]));
        }
      }

      // console.log(response)
      // for (const c of category) {
      //   for (const h of hfk) {
      //     console.log(response)
      //     const mastervalue = {
      //       reportingPeriod: ap,
      //       template: 'OHFS',
      //       org: {
      //         id: h.id,
      //         name: h.name,
      //       },
      //       categoryId: c.id,
      //       categoryName:c.name,
      //       attributeId: attribute.id,
      //       attributeName:attribute.name,
      //       value: response.data[0] ? response.data[0][2] : '',
      //     };

      //     if(mastervalue.value != ''|| mastervalue.value !=0 ){
      //       console.log(mastervalue);
      //       upd.push(addDocument(mastervalue));
      //     }
      //     // upd.push(addDocument(mastervalue));
      //   }
      // }

      Promise.all(upd).then(() => {
        console.log('Finished uploading.');
      });
    })
    .catch(error => {
      // console.log('There was an error when querying REST service.');
      console.log(error);
    });
};

const DoRetrieval = ({ category, ap, hfk, col }) => {
  if (category && ap && hfk && category.length > 0 && hfk.length > 0 && ap.length > 0) {
    // console.log(ap)
    const period = ap.split(' ')[0];
    console.log(period);
    let fnd = null;
    for (const elem of col) {
      if (elem.name === `${period} Actual`) {
        fnd = elem;
        break;
      }
    }
    if (fnd) {
      queryREST({ category, ap, hfk, attribute: fnd });
    } else alert("Attribute doesn't exist in database");
  } else alert('Missing one or more parameters.');
};

const HeaderActions = props => {
  return (
    <Paper className="header">
      <Typography variant="h5">Prepopulate from OHFS</Typography>
      <Selection {...props} />
    </Paper>
  );
};

const FooterActions = props => {
  return (
    <Paper className="footer">
      <div>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => DoRetrieval(props.getPopulateParameters())}
        >
          Get Actuals from OHFS
        </Button>
      </div>
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

// const getYears = () => {

//   const ret = [];
//   const cur = new Date().getFullYear();
//   for (let i = 2010; i <= cur; i++) {
//     ret.push(`${i}/${(i + 1) % 100}`);
//   }
//   return ret.reverse();
// };

const MasterValuePopulation = () => {
  const dispatch = useDispatch();

  const classes = useStyles();

  useEffect(() => {
    dispatch(getOrgsRequest());
    dispatch(getCOAsRequest());
    dispatch(getColumnNamesRequest());
    dispatch(getReportingPeriodsRequest());
  }, [dispatch]);

  // const yearList = useMemo(() => getYears(), []);
  // console.log(yearList)
  // const [hfkList, updateHfkList] = useState(
  //     getRange(1, 999).map(id => ({ checked: false, id: `${id}` }))
  // );

  const {
    db_categoryList,
    db_hfkList,
    db_columnNamesList,
    reportingPeriods,
    isCallInProgress,
  } = useSelector(state => ({
    db_categoryList: selectFactoryRESTResponseTableValues(selectCOAsStore)(state),
    db_hfkList: selectFactoryRESTResponseTableValues(selectOrgsStore)(state),
    db_columnNamesList: selectFactoryRESTResponseTableValues(selectColumnNamesStore)(state),
    reportingPeriods: selectFactoryRESTResponseTableValues(selectReportingPeriodsStore)(state),
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
    isCallInProgress,
  });

  const getYears = reportingPeriods => {
    console.log(reportingPeriods);
    const yearList = [];
    reportingPeriods.forEach(rp => {
      yearList.push(rp.name);
    });
    const ret = [];
    const cur = new Date().getFullYear();
    for (let i = 2010; i <= cur; i++) {
      ret.push(`${i}/${(i + 1) % 100}`);
    }
    return ret.reverse();
  };
  const yearList = useMemo(() => getYears(reportingPeriods), []);
  // console.log(yearList)
  // console.log(reportingPeriods)
  const periodList = [];
  reportingPeriods.forEach(period => {
    periodList.push(period.name);
  });
  periodList.sort().reverse();
  // console.log('periodList', periodList)

  const [categoryList, updateCategoryList] = useState([]);

  const [hfkList, updateHfkList] = useState([]);

  useEffect(() => {
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
      <FooterActions getPopulateParameters={getPopulateParameters} />
    </div>
  );
};

export default MasterValuePopulation;
