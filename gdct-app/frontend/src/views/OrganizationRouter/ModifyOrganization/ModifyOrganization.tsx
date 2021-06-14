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

type genObject = { [key: string]: any }

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

interface MOProps {
  [key: string]: any,
}

interface MOState {
  id: number,
  takenIds: number[],
  blockSubmit: boolean,
  [key: string]: any,
}

interface OrgFormProps {
  object: {[key: string]: any},
  preSubmit?: () => boolean | undefined,
  cancel: () => void,
  submit: () => void,
  handleChanges: (e: ChangeEvent) => void,
  updateState: (name: any, value: any) => void,
}

interface TabPanelProps {
  value: number,
  index: number,
  children: genObject,
  other?: genObject,
}

const OrganizationHeader = ({ title }: { title: string }) => {
  return (
    <Paper className="header">
      <Typography variant="h5">{title}</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const Label = ({ attribute, text }: { attribute: string, text: string }) => (
  <label htmlFor={attribute}>
    <Typography variant="subtitle2">{text}</Typography>
  </label>
);

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

interface LabelProps {
  attribute: string,
  text: string,
}

interface InputProps extends LabelProps {
  object: genObject,
  handleChanges: ChangeEventHandler,
  type: string,
  cannotEdit?: boolean,
}

interface TextGroupProps extends InputProps {
  fullWidth?: boolean,
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

const TextGroup = (props: TextGroupProps) => (
  <div className="InputGroup" style={{ width: props.fullWidth ? '100%' : '23%' }}>
    <Label {...props} />
    <br />
    <Input {...props} type={'text'} />
  </div>
);

interface ButtonGroupProps extends LabelProps {
  object: genObject,
  handleChanges: (e: ChangeEvent) => void,
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

const NumberGroup = (props: InputProps) => (
  <div className="InputGroup" style={{ width: '23%' }}>
    <Label {...props} />
    <br />
    <Input {...props} type="number" />
  </div>
);

const OrgInfo = (props: OrgFormProps) => (
  <div>
    <div
      // Align Expire Checkbox to the right side
      // @ts-ignore 
      align="right"> 
      <ButtonGroup {...props} attribute={'active'} text={'Expire Organization'} />
    </div>

    <TextGroup {...props} attribute={'name'} text={'Organization Name*'} fullWidth={true} type='text' />
    <TextGroup {...props} attribute={'legalName'} text={'Legal Name'} fullWidth={true} type='text' />

    <div className="formRow" id="basicInfo">
      <NumberGroup {...props} attribute={'id'} text={'Organization ID*'} type='number' />
      <TextGroup {...props} attribute={'code'} text={'Organization Code'} type='text' />
      <TextGroup {...props} attribute={'IFISNum'} text={'IFIS Number*'} type='text' />
      <TextGroup {...props} attribute={'effectiveDate'} text={'Effective Date'} type='text' />
    </div>

    <div className="formRow" id="locationInfo">
      <TextGroup {...props} attribute={'address'} text={'Address'} type='text' />
      <TextGroup {...props} attribute={'city'} text={'City'} type='text' />
      <TextGroup {...props} attribute={'province'} text={'Province'} type='text' />
      <TextGroup {...props} attribute={'postalCode'} text={'Postal Code'} type='text' />
    </div>

    <div className="formRow" id="userInfo">
      <TextGroup {...props} attribute={'authorizedUserId'} text={'Authoritative Person'} type='text' />
      <TextGroup {...props} attribute={'contactUserId'} text={"Authoritative Person's Email"} type='text' />
      {/*
                <userIdButton onChange={props.handleChanges}/>
            */}
    </div>
  </div>
);

OrgInfo.propTypes = {
  props: PropTypes.object,
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  const display = value === index ? 'inline' : 'none'

  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{display: display}}
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

class ModifyOrganization extends React.Component<MOProps, MOState> {
  constructor(props: MOProps) {
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

  componentDidUpdate (prevProps: MOProps, prevState: MOState) {
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
