import React, { MouseEvent, useMemo, useCallback } from 'react';

import { useDispatch } from 'react-redux';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import Fab from '@material-ui/core/Fab';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Button from '@material-ui/core/Button';

import { cx, css } from 'emotion';

import SubmissionPeriodDialog from './dialogs/SubmissionPeriodDialog';
import StatusDialog from './dialogs/StatusDialog';
import ProgramDialog from './dialogs/ProgramDialog';
import TemplateTypeDialog from './dialogs/TemplateTypeDialog';
import ReportingPeriodDialog from './dialogs/ReportingPeriodDialog';
//@ts-ignore
import DialogsStore from '../store/DialogsStore/store';
import TemplateDialog from './dialogs/TemplateDialog';
import OrganizationDialog from './dialogs/OrganizationDialog';
import WorkflowDialog from './dialogs/WorkflowDialog';
import SubmissionPeriod from '../types/submissionperiod';
import Template from '../types/template';
import Organization from '../types/organization';
import Program from '../types/program';
import Workflow from '../types/workflow';
export const DeleteButton = ({ handleDelete }:{handleDelete:()=>void}) => (
  <IconButton onClick={handleDelete} aria-label="delete">
    <DeleteIcon />
  </IconButton>
);

export const AddFabIconButton = ({ className, handleClick, title }:
  {className:string, handleClick:()=>void, title:string}
  ) => (
  <Fab
    className={className}
    color="primary"
    variant="extended"
    aria-label="add"
    onClick={handleClick}
  >
    <AddCircleIcon />
    {title}
  </Fab>
);

export const MarkIcon = ({ className, ...props }:{className:string, props:any}) => (
  <span
    {...props}
    //@ts-ignore
    ref={ref}
    className={cx(
      'material-icons',
      className,
      css`
        font-size: 18px;
        vertical-align: text-bottom;
      `,
    )}
  />
);

const MarkToggler = ({ className, active, reversed, ...props }:
  {className:string, active:boolean, reversed:boolean,props:any}
  ) => (
  <span
    {...props}
    className={cx(
      className,
      css`
        cursor: pointer;
        color: ${reversed ? (active ? 'white' : '#aaa') : active ? 'black' : '#ccc'};
      `,
    )}
  />
);


export const SelectIdButton = ({ value, action, children }:{value:any, action:any, children:any}) => {
  const dispatch = useDispatch();

  const text = useMemo(() => (value === undefined ? 'SELECT ID' : value), [value]);

  const handleClick = useCallback(() => {
    dispatch(action());
  }, [dispatch]);

  return (
    <div>
      <Button className="text-lowercase" onClick={handleClick}>
        {text}
      </Button>
      {children}
    </div>
  );
};

export const OrganizationIdButton = ({ value, onChange }:{value:string, onChange:(id:string)=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_ORGANIZATION_DIALOG}>
    <OrganizationDialog handleChange={onChange} />
  </SelectIdButton>
);

export const SubmissionPeriodIdButton = ({ value, onChange }:{value:string, onChange:(data:SubmissionPeriod)=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_SUBMISSION_PERIOD_DIALOG}>
    <SubmissionPeriodDialog handleChange={onChange} />
  </SelectIdButton>
);

export const ReportingPeriodIdButton = ({ value, onChange }:{value:string, onChange:(id:string)=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_REPORTING_PERIOD_DIALOG}>
    <ReportingPeriodDialog handleChange={onChange} />
  </SelectIdButton>
);

export const StatusIdButton = (props:any) => {
  const { value, onChange, isPopulated = false } = props;
  return (
    <SelectIdButton value={value} action={DialogsStore.actions.OPEN_STATUS_DIALOG}>
      <StatusDialog handleChange={d => onChange(isPopulated ? d : d._id)} />
    </SelectIdButton>
  );
};

export const ProgramIdButton = ({ value, onChange }:{value:string, onChange:(data:Program)=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_PROGRAM_DIALOG}>
    {/*@ts-ignore*/}
    <ProgramDialog handleChange={onChange} />
  </SelectIdButton>
);

export const TemplateIdButton = ({ value, onChange }:{value:string, onChange:(data:Template)=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_TEMPLATE_DIALOG}>
    {/*@ts-ignore*/}
    <TemplateDialog handleChange={onChange} />
  </SelectIdButton>
);

export const WorkflowIdButton = ({ value, onChange, isPopulated = false }:{value:string, onChange:(data:string|Workflow)=>void, isPopulated:boolean}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_WORKFLOW_DIALOG}>
    {/*@ts-ignore*/}
    <WorkflowDialog handleChange={d => onChange(isPopulated ? d : d._id)} />
  </SelectIdButton>
);

export const TemplateTypeIdButton = ({ value, onChange }:{value:string, onChange:()=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_TEMPLATE_TYPE_DIALOG}>
    <TemplateTypeDialog handleChange={onChange} />
  </SelectIdButton>
);

export const UserIdButton = ({ value, onChange }:{value:string, onChange:()=>void}) => (
  <SelectIdButton value={value} action={DialogsStore.actions.OPEN_USER_DIALOG}>
    {/* <TemplateTypeDialog handleChange={onChange}/> */}
  </SelectIdButton>
);
