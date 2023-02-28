// Oct 16, 2020
// This file exports a page that users can go in to edit templatate spreadsheet files.
// Since the application is moving onto using google sheets by opening a new tab, this file is currently not being used.

import React, { useEffect, useCallback, useState } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RouteComponentProps, RouterProps, useHistory } from 'react-router-dom';
import { Button, Chip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Spreadsheet from './spreadSheet';
//@ts-ignore
import Loading from '../../../components/Loading/Loading';

import { getTemplateRequest, updateTemplateWorkflowProcess } from '../../../store/thunks/template';

import './Template.scss'; 
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import { selectFactoryValueById } from '../../../store/common/REST/selectors';
import workflowController from '../../../controllers/workflow';
import TemplatesStore from '../../../store/TemplatesStore/store';
import Template from '../../../types/template';
import WorkflowProcess from '../../../types/workflowprocess';
import { state } from '../../../store/types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import { withStyles } from '@material-ui/core/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import statusController from '../../../controllers/status';

interface ProcessPopulated extends Omit<WorkflowProcess, 'to'> {
  to: WorkflowProcess[],
}

const TemplatePhases = ({ template }: { template: Template }) => {
  const [workflowProcess, setWorkflowProcess] = useState<ProcessPopulated | undefined>();
  let buttonStatus = true;
  const dispatch = useDispatch();
  const currRole = localStorage.getItem('currentRole');
  const [confirmPhase, setConfirmPhase] = useState(false);
  const [confirmWinOpen, setConfirmWinOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('confirm');
  const [curProcessId, setCurProcessId] = useState('');
  const [curPhase, setCurPhase] = useState('NULL'); // current phase of the template

  if (currRole === 'Template Designer' || currRole === 'Business Admin') {
    buttonStatus = false;
  }

  useEffect(() => {
    if (template)
      workflowController
        .fetchProcess(template.workflowProcessId)
        //@ts-ignore this call should be populated based on what comes later
        .then((workflowProcess: ProcessPopulated[]) => setWorkflowProcess(workflowProcess || undefined));
  }, [template]);

// trigger phase action change
  const handleClickWorkflow = useCallback(
    (processId: any) => {
      dispatch(updateTemplateWorkflowProcess(template._id, processId));
    },
    [template, dispatch],
  );

  // proceed handleClickWorkflow phase change only if user press confirm button
  const handleConfirmClickWorkflow = (processId: any) => {
    setMessage('Do you want to confirm or reject? The next phase will be executed.');
    setAction('confirm');
    setConfirmWinOpen(true);
    setCurProcessId(processId);
  };

  // Note: useEffect is called after confirmPhase is set to true. 
  // If this code block is in handleConfirmClickWorkflow,
  // before SnackBar being clicked, confirmPhase checking is already triggered, 
  // the effect will not be triggered immediately after SnackBar clicked.
  useEffect(() => {
    if (confirmPhase) { 
      if (curProcessId !== '') handleClickWorkflow(curProcessId);
    } else {}
    return () => {setConfirmPhase(false);};
  }, [confirmPhase]);

  // handle confirm button in SnackBar
  const handleConfirm = () => {
    setMessage('Confirmed!');
    setAction('');
    setConfirmPhase(true);
    setConfirmWinOpen(false);
  };

  // handle reject button in SnackBar
  const handleReject = () => {
    setMessage('Rejected!');
    setAction('');
    setConfirmPhase(false);
    setConfirmWinOpen(false);
  };

  // handle close button in SnackBar
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    // do nothing
  };

  // set the style of SnackBar to white background and black text
  const WhiteSnackbarContent = withStyles({
    root: {
      color: 'black',
      backgroundColor: 'white',
    },
  })(SnackbarContent);

  // console log workflowProcess for debugging
  useEffect(() => {
    if (workflowProcess) {
      //setCurPhase(workflowProcess.statusId.name);
      console.log('workflowProcess: ', workflowProcess);
      // search current status name by status id
      // @ts-ignore
      statusController.findStatusByID(workflowProcess.statusId).then((status) => {
        if (status) {
          setCurPhase(status.name);
        }
      });
    } else {}
  }, [workflowProcess,confirmPhase]);

  return (
    <div>
      <Paper className="header">
        <Typography variant="h5">{template.name}</Typography>
        <div className="mb-3 d-flex justify-content-end">
          <Chip className="rounded" color="primary" label={"Current Phase: "+ curPhase} />
          {workflowProcess && workflowProcess.to.length ? (
            workflowProcess.to.map((outwardProcess) => (
              <div>
              <Button
                disabled={buttonStatus}
                key={outwardProcess._id}
                onClick={() => handleConfirmClickWorkflow(outwardProcess._id)}
                style={{ textTransform: 'none' }} 
              >
                {"Next Phase: " + outwardProcess.statusId.name}
              </Button>
              
                <Snackbar
                  open={confirmWinOpen}
                  onClose={handleClose}
                  message={message}
                  style={{ position: 'absolute', top: '130px', left: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <WhiteSnackbarContent 
                  message={message} 
                  action={
                    action === 'confirm' ? (
                      <React.Fragment>
                        <Button color="secondary" size="small" onClick={handleReject}>
                          Reject
                        </Button>
                        <IconButton size="small" color="inherit" onClick={handleConfirm}>
                          <CheckCircleIcon />
                        </IconButton>
                      </React.Fragment>
                    ) : (
                      <IconButton size="small" color="inherit" onClick={handleClose}>
                        <CancelIcon />
                      </IconButton>
                    )
                  }
                  />
                </Snackbar>
            
            </div>
            ))
          ) : (
            <Chip className="rounded" color="secondary" label="Finalized" />
          )}
        </div>
      </Paper>
    </div>
  );
};

const Template = ({
  match: {
    params: { _id },
  },
}: RouteComponentProps<{ _id: string }>) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { template } = useSelector(
    (state: state) => ({
      template: selectFactoryValueById(selectTemplatesStore)(_id)(state),
    }),
    shallowEqual,
  );

  const handleSaveTemplate = useCallback(() => {
    // dispatch(updateTemplateExcelRequest());
  }, []);

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getTemplateRequest(_id));

    return () => {
      dispatch(TemplatesStore.actions.RESET(''));
    };
  }, [_id]);

  return template && template.templateData ? (
    <div>
      <TemplatePhases template={template} />
     
      <Spreadsheet templateID={_id} name={template.name} backButton={()=>history.push('/admin/template/design')}/>
    </div>
  ) : (
    <Loading />
  );
};
export default Template;
