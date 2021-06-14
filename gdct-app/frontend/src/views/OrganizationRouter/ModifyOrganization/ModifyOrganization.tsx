// ModifyOrganization is the parent page for CreateOrganization and EditOrganization
import React, { useState, useEffect, ChangeEventHandler, ChangeEvent } from 'react';
//@ts-ignore
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';

import PropTypes from 'prop-types';
import moment from 'moment';

import { Paper, Button, Typography, TextField, AppBar, Tabs, Tab, Checkbox} from '@material-ui/core';

import './ModifyOrganization.scss';
import ProgList from '../ProgramList';
//@ts-ignore
import ErrorBanner from '../../ErrorBanner'

//@ts-ignore
import orgController from '../../../controllers/organization'
//@ts-ignore
import OrgsStore from '../../../store/OrganizationsStore/store'
import { connect } from 'react-redux'

interface Program {
  _id: string,
  code: string,
  isActive: boolean,
  name: string,
  tableData: {
    id: number,
  },
  timestamp: string,
  updatedAt: string,
  updatedBy: string,
}

interface Organization {
  _id: string,
  id: number,
  effectiveDate: string,
  expiryDate?: null,
  name: string,
  IFISNum: string,
  province?: string,
  organizationGroupId: string[],
  programId: string[],
  authorizedPerson: {
    name: string,
    email: string,
  },
  active?: boolean,
  address?: string,
  city?: string,
  code?: string,
  legalName?: string,
  location?: [],
  managerUserIds?: [],
  postalCode?: string,
}

const OrganizationHeader = ({ title }: { title: string }) => {
  return (
    <Paper className="header">
      <Typography variant="h5">{title}</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

OrganizationHeader.propTypes = {
  title: PropTypes.string,
};

const Label = ({ attribute, text }: { attribute: string, text: string }) => (
  <label htmlFor={attribute}>
    <Typography variant="subtitle2">{text}</Typography>
  </label>
);

Label.propTypes = {
  attribute: PropTypes.string,
  text: PropTypes.string,
};

const currentTime = () => {
  return moment().format();
};

// using very generic object here
const getValue = (object: { [key: string]: any }, attribute: string) => {
  let value;
  switch (typeof object[attribute]) {
    case 'undefined':
      value = '';
      break;
    default:
      value = object[attribute];
  }
  switch (attribute) {
    case 'effectiveDate':
      value = currentTime();
  }
  return { value };
};

getValue.propTypes = {
  object: PropTypes.object,
  attribute: PropTypes.string,
};

interface InputProps {
  object: { [key: string]: any },
  attribute: string,
  text: string,
  handleChanges: ChangeEventHandler,
  type: string,
  cannotEdit: boolean,
}

const Input = ({ object, attribute, text, handleChanges, type, cannotEdit }: InputProps) => (
  <TextField
    name={attribute}
    type={type}
    placeholder={`Enter ${text}`}
    {...getValue(object, attribute)}
    variant="outlined"
    onChange={handleChanges}
    fullWidth={true}
    disabled={!object.active || cannotEdit}
  />
);

Input.propTypes = {
  object: PropTypes.object,
  attribute: PropTypes.string,
  text: PropTypes.string,
  handleChanges: PropTypes.func,
  type: PropTypes.string,
  cannotEdit: PropTypes.bool,
};

// TODO REMOVE ANY PLS JULIEN
const TextGroup = (props: any) => (
  <div className="InputGroup" style={{ width: props.fullWidth ? '100%' : '23%' }}>
    <Label {...props} />
    <br />
    <Input {...props} type={'text'} />
  </div>
);

TextGroup.propTypes = {
  fullWidth: PropTypes.bool,
};

// NOT a generic button group, DO NOT REUSE for other purposes
// TODO REMOVE ANY PLS JULIEN
const ButtonGroup = (props: any) => (
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

ButtonGroup.propTypes = {
  attribute: PropTypes.string,
  object: PropTypes.object,
  handleChanges: PropTypes.func,
};

// TODO REMOVE ANY PLS JULIEN
const NumberGroup = (props: any) => (
  <div className="InputGroup" style={{ width: '23%' }}>
    <Label {...props} />
    <br />
    <Input {...props} type="number" />
  </div>
);

NumberGroup.propTypes = {
  props: PropTypes.object,
};

// TODO REMOVE ANY PLS JULIEN
const OrgInfo = (props: any) => (
  <div>
    <div
      // Align Expire Checkbox to the right side
      // @ts-ignore 
      align="right"> 
      <ButtonGroup {...props} attribute={'active'} text={'Expire Organization'} />
    </div>

    <TextGroup {...props} attribute={'name'} text={'Organization Name*'} fullWidth={true} />
    <TextGroup {...props} attribute={'legalName'} text={'Legal Name'} fullWidth={true} />

    <div className="formRow" id="basicInfo">
      <NumberGroup {...props} attribute={'id'} text={'Organization ID*'} />
      <TextGroup {...props} attribute={'code'} text={'Organization Code'} />
      <TextGroup {...props} attribute={'IFISNum'} text={'IFIS Number*'} />
      <TextGroup {...props} attribute={'effectiveDate'} text={'Effective Date'} cannotEdit={true} />
    </div>

    <div className="formRow" id="locationInfo">
      <TextGroup {...props} attribute={'address'} text={'Address'} />
      <TextGroup {...props} attribute={'city'} text={'City'} />
      <TextGroup {...props} attribute={'province'} text={'Province'} />
      <TextGroup {...props} attribute={'postalCode'} text={'Postal Code'} />
    </div>

    <div className="formRow" id="userInfo">
      <TextGroup {...props} attribute={'authorizedUserId'} text={'Authoritative Person'} />
      <TextGroup {...props} attribute={'contactUserId'} text={"Authoritative Person's Email"} />
      {/*
                <userIdButton onChange={props.handleChanges}/>
            */}
    </div>
  </div>
);

OrgInfo.propTypes = {
  props: PropTypes.object,
};

// TODO REMOVE ANY PLS JULIEN
const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      display={value === index ? 'inline' : 'none'}
      {...other}
    >
      {children}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.object,
  value: PropTypes.number,
  index: PropTypes.number,
  other: PropTypes.object,
};

const makeIdentifier = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

makeIdentifier.propTypes = {
  index: PropTypes.any,
};

// TODO PLS REMOVE ANY JULIEN
const OrganizationForm = (props: any) => {
  const [current, setCurrent] = useState(0);
  const [programIds, setProgramIds] = useState(props.object.programId)
  const handleChange = (event: ChangeEvent<{}>, value: number) => setCurrent(value);
  useEffect(() => {
    props.updateState('programId', programIds)
  }, [programIds])

  const onClickAdd = (_event: Event, program: Program) => {
    setProgramIds((prevIds: string[]) => prevIds.concat(program._id));
  };

  const onClickDelete = (_event: Event, program: Program) => {
    setProgramIds((prevIds: string[]) => prevIds.filter(elem => elem !== program._id))
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

OrganizationForm.propTypes = {
  updateState: PropTypes.func,
  object: PropTypes.object,
  cancel: PropTypes.func,
  submit: PropTypes.func,
};

interface IProps {
  [key: string]: any,
}

interface IState {
  id: number,
  takenIds: number[],
  blockSubmit: boolean,
  [key: string]: any,
}

class ModifyOrganization extends React.Component<IProps, IState> {
  //TODO PLS JULIEN REMOVE ANY HERE
  constructor(props: IProps) {
    super(props);
    const temp = { ...props.object };
    delete temp._id;
    this.state = {
      ...temp,
      takenIds: [],
      blockSubmit: false
    }
    this.updateState = this.updateState.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.preSubmit = this.preSubmit.bind(this)
  }

  componentDidMount () {
    orgController.fetch().then((orgs: Organization[]) => {
      if (orgs) {
        this.setState({
          // all organization ids except the one currently being edited
          takenIds: orgs.map(org => org.id).filter((id: number) => id !== this.props.object.id)
        })
      }
    })
  }

  componentDidUpdate (prevProps: IProps, prevState: IState) {
    if (prevState.id !== this.state.id) {
      if (this.state.takenIds.includes(this.state.id)) {
        this.setState({
          blockSubmit: true
        })
      } else {
        this.setState({
          blockSubmit: false
        })
      }
    }
  }

  updateState(name: any, value: any) {
    this.setState(state => ({ ...state, [name]: value }));
  }

  handleChanges(e: Event) {
    const { name, value, checked, type } = (e.target as HTMLInputElement);
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

  preSubmit () {
    if (this.state.blockSubmit) {
      // random used here so that ErrorBanner displays every attempted submit
      this.props.dispatch(OrgsStore.actions.FAIL_REQUEST('Duplicate id is not allowed' + Math.random().toString()))
      return false
    } else {
      this.props.submit(this.state)
    }
  }

  render() {
    return (
      <div>
        <OrganizationHeader title={this.props.title} />
        <ErrorBanner title={"The organization ID already exists in the database. Please select a unique ID"} targetStore={selectOrgsStore}/>
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

const ConnectedModifyOrganization = connect(state => ({...state}))(ModifyOrganization)

export default ConnectedModifyOrganization;
