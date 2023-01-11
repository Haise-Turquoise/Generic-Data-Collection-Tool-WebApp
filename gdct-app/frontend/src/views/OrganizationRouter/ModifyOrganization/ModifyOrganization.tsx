// ModifyOrganization is the parent page for CreateOrganization and EditOrganization
import React, { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';
import PropTypes from 'prop-types';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
//import Select, { SelectChangeEvent } from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import OrganizationGroup from '../../../types/organizationgroup';
import { borders } from '@material-ui/system';
import {
  Paper,
  Button,
  Typography,
  TextField,
  AppBar,
  Tabs,
  Tab,
  Checkbox,
} from '@material-ui/core';

import './ModifyOrganization.scss';
import ProgList from '../ProgramList';
import orgController from '../../../controllers/organization';
import { connect } from 'react-redux';
import userController from '../../../controllers/user';
import Organization from '../../../types/organization';
import Program from '../../../types/program';
import organizationGroupController from '../../../controllers/organizationGroup';
import Swal from 'sweetalert2'

import { Formik } from 'formik';
import * as yup from 'yup';
//@ts-ignore
import useStyles from '../../../styles/dropdownStyle';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { setEmitFlags } from 'typescript';

type genObject = { [key: string]: any };

interface MOProps {
  [key: string]: any;
}

interface MOState {
  id: number;
  error_id: boolean;
  takenIds: number[];
  error: string;
  [key: string]: any;
}

interface OrgFormProps {
  object: { [key: string]: any };
  preSubmit?: () => boolean | undefined;
  cancel: () => void;
  submit: () => void;
  handleChanges: (e: ChangeEvent) => void;
  updateState: (name: any, value: any) => void;
}

interface TabPanelProps {
  value: number;
  index: number;
  children: genObject;
  other?: genObject;
}

const OrganizationHeader = ({ title }: { title: string }) => {
  return (
    <Paper className="header">
      <Typography variant="h5">{title}</Typography>
    </Paper>
  );
};

const Label = ({ attribute, text }: { attribute: string; text: string }) => (
  <label htmlFor={attribute}>
    <Typography variant="subtitle2">{text}</Typography>
  </label>
);

const currentTime = () => {
  return moment().format();
};

// using very generic object here
const getValue = async (object: { [key: string]: any }, attribute: string) => {
  let value;
  switch (typeof object[attribute]) {
    case 'undefined':
      if(attribute.charAt(16) === '.'){
        value = object['authorizedPerson']? object[attribute.substring(0,16)][attribute.substring(17)]: '';
      }else{
        value = '';
      }
      break;
    default:
      value = object[attribute];
      
  }
  switch (attribute) {
    case 'effectiveDate':
      value = currentTime();
      break;
  }
  return { value: value };
};

interface LabelProps {
  attribute: string;
  text: string;
}

interface InputProps extends LabelProps {
  object: genObject;
  handleChanges: ChangeEventHandler;
  type: string;
  cannotEdit?: boolean;
}

interface TextGroupProps extends InputProps {
  fullWidth?: boolean;
  updateState: (name: any, value: any) => void;
}


//Added validation scheme in here, and is extendable to the other form fields as well
//first, it is checked in componentDidUpdate, 
//then the necessary fields (error_item and object.item) are properly set in componentDidUpdate
//
const InputLocal = ({ object, attribute, text, handleChanges, type, cannotEdit }: InputProps) => {
  let errorSignal = false;
  let errorMessage = '';
  switch (attribute) {
    case 'id':
      if (isNaN(object.id ) && object.error_id) {
        errorSignal = true;
        errorMessage = 'This ID is not valid';
      }
      if(object.takenIds.includes(Number(object.id))) {
        errorSignal = true;
        errorMessage = 'This ID is a duplicate';
      }
    //add cases for other validations here, matching preliminary checks in componentDidUpdate
  }
  const [val, setVal] = useState('stringVal');
  useEffect(() => {
    const getVal = async () => {
      await getValue(object, attribute).then((res) => {
        console.log(`useEffect val: ` + res.value);
        setVal(res.value)
      });
    }
    getVal();
  }, []);
  return (
    <TextField
      name={attribute}
      type={type}
      placeholder={`Enter ${text}`}
      {...{ value: val }}
      variant="outlined"
      onChange={handleChanges}
      fullWidth={true}
      disabled={!object.active || cannotEdit}
      error={errorSignal}
      helperText={errorMessage}
    />
  )
};

const TextGroup = (props: TextGroupProps) => {
  const [organizationGroupNames, setOrganizationGroupNames] = useState<any[]>([]);
  const [curOrgName, setCurOrgName] = useState<string>('');
  let organizationGroupNames2: any[] = [];
  const classes = useStyles();
  useEffect(()=>{
    let isMounted = true;
    if (props.attribute === 'organizationGroup') {
      const getOrgName = async () => {
      
        //  current org name list
        await organizationGroupController.searchAll().then((res) => {
          if(isMounted) organizationGroupNames2 = res;
        });
        //console.log('retrieved org groups2: ', organizationGroupNames2);
        setOrganizationGroupNames(organizationGroupNames2);

        //  current org name
        await organizationGroupController.getOrganizationGroupName(props.object.organizationGroupId[0])
          .then((res) => { setCurOrgName(res.name) });
        
      };
      getOrgName();
      
      return () => { isMounted = false }
    };
  },[]);


  const handleChange = async (event: React.ChangeEvent<{value: unknown}>) => {                                                                                                                                     
    setCurOrgName(event.target.value as string);
    let curOrgGroupIdStringList = ["wrong"];
    // WARNING: ignore await may cause bugs
    // await organizationGroupController.getOrganizationGroupIdByOrgName(curOrgName).then(res=>(curOrgGroupIdStringList=res));
    //console.log('before search curOrgGroupNameId');
    let curOrgGroupNameId = organizationGroupNames.find((item)=>(item.name==event.target.value))._id;
    //console.log('after search curOrgGroupNameId');
    //console.log('curOrgGroupNameId: ', curOrgGroupNameId);
    curOrgGroupIdStringList[0]=curOrgGroupNameId;
    // some code for retrive current id
    if (curOrgGroupIdStringList[0] === "wrong") {
      //console.log('ERROR: curOrgGroupIdStringList NOT UPDATED');
    } else {
      props.updateState('organizationGroupId', curOrgGroupIdStringList);
      //console.log('curOrgName: ', curOrgName);
    }
  };
  


  return (
  <div className="InputGroup" style={{ width: props.fullWidth ? '100%' : '23%' }}>
    <Label {...props} />
    <br />
    {props.attribute !== 'organizationGroup' && <InputLocal {...props} type={'text'} />}
    {(props.attribute === 'organizationGroup' && organizationGroupNames.length !== 0) &&
      <FormControl variant="outlined" className={classes.formControl}>
      <Select onChange={handleChange} value={curOrgName} fullWidth required className='classes.select'>
        {organizationGroupNames.map(organizationGroupName => 
          <MenuItem key = {organizationGroupName._id} value={`${organizationGroupName.name}`}>
            {`${organizationGroupName.name}`}
          </MenuItem>)}
      </Select>
      </FormControl>
    }
  </div>
  );
};

interface ButtonGroupProps extends LabelProps {
  object: genObject;
  handleChanges: (e: ChangeEvent) => void;
}

// NOT a generic button group, DO NOT REUSE for other purposes
const ButtonGroup = (props: ButtonGroupProps) => (
  <div className="InputGroup">
    <Label {...props} />
    <Checkbox
      color="primary"
      name={props.attribute}
      checked={!props.object[props.attribute]}
      onChange={props.handleChanges}
    />
  </div>
);


const OrgInfo = (props: OrgFormProps) => (
  <div>
    <div
      // Align Expire Checkbox to the right side
      // @ts-ignore
      align="right"
    >
      <ButtonGroup {...props} attribute={'active'} text={'Expire Organization'} />
    </div>

    <TextGroup
      {...props}
      attribute={'name'}
      text={'Organization Name*'}
      fullWidth={true}
      type="text"
    />
     <TextGroup
      {...props}
      attribute={'organizationGroup'}
      text={'Organization Group*'}
      fullWidth={true}
      type="text"
    />
    <TextGroup
      {...props}
      attribute={'legalName'}
      text={'Legal Name'}
      fullWidth={true}
      type="text"
    />

    <div className="formRow" id="basicInfo">
      <TextGroup {...props} attribute={'id'} text={'Organization ID*'} type="number" />
      <TextGroup {...props} attribute={'code'} text={'Organization Code'} type="text" />
      <TextGroup {...props} attribute={'IFISNum'} text={'IFIS Number*'} type="text" />
      <TextGroup {...props} attribute={'effectiveDate'} text={'Effective Date'} type="text" />
    </div>

    <div className="formRow" id="locationInfo">
      <TextGroup {...props} attribute={'address'} text={'Address'} type="text" />
      <TextGroup {...props} attribute={'city'} text={'City'} type="text" />
      <TextGroup {...props} attribute={'province'} text={'Province'} type="text" />
      <TextGroup {...props} attribute={'postalCode'} text={'Postal Code'} type="text" />
    </div>

    <div className="formRow" id="userInfo">
      <TextGroup
        {...props}
        attribute={'authorizedPerson.name'}
        text={'Authoritative Person'}
        type="text"
      />
      <TextGroup
        {...props}
        attribute={'authorizedPerson.email'}
        text={"Authoritative Person's Email"}
        type="text"
      />
      {/*
                <userIdButton onChange={props.handleChanges}/>
            */}
    </div>
  </div>
);

OrgInfo.propTypes = {
  props: PropTypes.object,
};

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;
  const display = value === index ? 'inline' : 'none';

  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ display: display }}
      {...other}
    >
      {children}
    </div>
  );
};

const makeIdentifier = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

const OrganizationForm = (props: OrgFormProps) => {
  const [current, setCurrent] = useState(0);
  const [programIds, setProgramIds] = useState(props.object.programId);
  const handleChange = (event: ChangeEvent<{}>, value: number) => setCurrent(value);
  useEffect(() => {
    props.updateState('programId', programIds);
  }, [programIds]);

  const onClickAdd = (_event: Event, program: Program | Program[]) => {
    if (!Array.isArray(program)) {
      setProgramIds((prevIds: string[]) => prevIds.concat(program._id));
    }
  };

  const onClickDelete = (_event: Event, program: Program | Program[]) => {
    if (!Array.isArray(program)) {
      setProgramIds((prevIds: string[]) => prevIds.filter(elem => elem !== program._id))
    }
  };

  return (
    <Paper>
      <form onSubmit={() => false}>
        <AppBar
          position="static"
          color="transparent"
          style={{ background: 'transparent', boxShadow: 'none' }}
        >
          <Tabs
            value={current}
            onChange={handleChange}
            aria-label="form navigation"
            indicatorColor="primary"
          >
            <Tab label="Organization Info" {...makeIdentifier(0)} />
            <Tab label="Program List" {...makeIdentifier(1)} />
          </Tabs>
        </AppBar>

        <div className="formBody">
          <TabPanel value={current} index={0}>
            <OrgInfo {...props} />
          </TabPanel>
          <TabPanel value={current} index={1}>
            <ProgList
              programIds={programIds}
              isEditable={props.object.active}
              onClickAdd={onClickAdd}
              onClickDelete={onClickDelete}
            />
          </TabPanel>

          <div className="formActions">
            <Button
              type="button"
              color="primary"
              variant="contained"
              size="large"
              onClick={() => props.cancel()}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="SaveButton"
              color="primary"
              variant="contained"
              size="large"
              onClick={() => props.submit()}
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
};

class ModifyOrganization extends React.Component<MOProps, MOState> {
  constructor(props: MOProps) {
    super(props);
    const temp = { ...props.object };
    delete temp._id;
    this.state = {
      ...temp,
      takenIds: [],
      error: null,
    };
    this.updateState = this.updateState.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.preSubmit = this.preSubmit.bind(this);
  }

  componentDidMount() {
    orgController.fetch({}).then((orgs: Organization[]) => {
      if (orgs) {
        this.setState({
          // all organization ids except the one currently being edited
          takenIds: orgs.map(org => org.id).filter((id: number) => id !== this.props.object.id),
        });
      }
    });
  }

  async componentDidUpdate (prevProps: MOProps, prevState: MOState) {
    //error_id indicates that there is an error with the id field
    let error_id = false;
    
    if (!prevProps.object && this.props.object) {
      this.setState({
        ...this.props.object
      })
    }

    // check errors
    if (prevState.id !== this.state.id
        || prevState.name !== this.state.name
        || prevState.IFISNum !== this.state.IFISNum
        || prevState.authorizedPerson.email !== this.state.authorizedPerson.email
      ) {
        if (this.state.takenIds.includes(Number(this.state.id))) {
          error_id = true;
          this.setState({error_id: error_id});
          this.setState({
            error: 'Duplicate ID not allowed',
          });
        } else {
          this.setState({
            error: '',
          });
        }
        if (isNaN(this.state.id)) {
          error_id = true;
          this.setState({ error: 'ID format is incorrect'})
          this.setState({error_id: error_id});
        }
        if (!this.state.name) {
          this.setState({ error: 'Name is required' })
          return
        }
        if (!this.state.IFISNum) {
          this.setState({ error: 'IFISNum is required' })
        }
        const fetchData = await userController.fetchUserByEmail(this.state.authorizedPerson.email);
        // console.log(fetchData.user);
        if (fetchData.user === undefined){
          this.setState({ error: 'Email is invalid' })
        }
    }

  }
  updateState(name: any, value: any) {
    if(name === 'authorizedPerson.name'){
      const person = {name: value, email: this.state.authorizedPerson? this.state.authorizedPerson.email: ''};
      this.setState(state => ({ ...state, ['authorizedPerson']: person }));
    }else if(name === 'authorizedPerson.email'){
      const person = {name: this.state.authorizedPerson? this.state.authorizedPerson.name: '', email: value};
      this.setState(state => ({ ...state, ['authorizedPerson']: person }));   
    }else{
      this.setState(state => ({ ...state, [name]: value }));
    }
  }

  handleChanges(e: Event) {
    const { name, value, checked, type } = e.target as HTMLInputElement;
    let updateValue;
    switch (type) {
      case 'checkbox':
        updateValue = !checked;
        break;
      case 'number':
        updateValue = parseInt(value);
        break;
      default:
        updateValue = value;
    }

    if (name === 'active') {
      if (updateValue) {
        this.updateState('expiryDate', null);
      } else {
        this.updateState('expiryDate', currentTime());
      }
    }
    this.updateState(name, updateValue);
  }

  preSubmit() {
    if (this.state.error) {
      Swal.fire({
        title: 'Error',
        text: this.state.error,
        icon: 'error'
      })
      return false;
    } else {
      this.props.submit(this.state);
    }
  }

  render() {
    return (
      <div>
        <OrganizationHeader title={this.props.title} />
        {/* <ErrorBanner
          title={'The organization ID already exists in the database. Please select a unique ID'}
          targetStore={selectOrgsStore}
        /> */}
        <OrganizationForm
          object={this.state}
          submit={this.preSubmit}
          cancel={this.props.cancel}
          // @ts-ignore
          handleChanges={this.handleChanges}
          updateState={this.updateState}
        />
      </div>
    );
  }
}
// This line below is not useful, but it may be required for the code to compile, check EditOrganization.tsx for database record shape
const ConnectedModifyOrganization = connect(state => ({ ...state }))(ModifyOrganization);

export default ConnectedModifyOrganization;
