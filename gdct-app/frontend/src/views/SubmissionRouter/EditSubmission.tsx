import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useEffect, useState, ChangeEvent } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// @ts-ignore
import cloneDeep from 'clone-deep';
import { useLocation } from 'react-router-dom';
import MaterialTable from 'material-table';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';

// @ts-ignore
import { templateDownloader } from '../../tools/misc';
// @ts-ignore
import { getSubmissionNoteRequest } from '../../store/thunks/submissionNote';
// @ts-ignore
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
// @ts-ignore
import SubmissionController from '../../controllers/submission';
// @ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
// @ts-ignore
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
// @ts-ignore
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import {
  getSubmissionByIdRequest,
  updateSubmissionStatusRequest,
  // @ts-ignore
} from '../../store/thunks/submission';
// import DOWNLOAD from '../../store/reducers/ui/excel/commands/DOWNLOAD';
// @ts-ignore
import { selectSubmissionNoteHistoryStore } from '../../store/SubmissionNoteHistoryStore/selectors';
// @ts-ignore
import workflowController from '../../controllers/workflow';
// @ts-ignore
import statusController from '../../controllers/status';
import { History } from 'history';
import WorkflowProcess from '../../types/workflowprocess';
import Status from '../../types/status';
import VisitedNode from '../../types/visitednode';
import SubmissionNote from '../../types/submissionnote';
// import { Submission } from '../../types/submissions';
//@ts-ignore
import roleSubmissionButtonController from '../../controllers/RoleSubmissionButton';
import RoleSubmissionButton from '../../types/rolesubmissionbutton';
import Submission from '../../types/submission';
const timeOption = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};


const EditSubmission = ({ history }:{history:History}) => {
  const dispatch = useDispatch();
  const location:any = useLocation();
  const [submissionId, setSubmissionId] = useState(location.state.detail._id);
  // const [submitUnavailable, setSubmitUnavailable] = useState(true);
  // const [approveUnavailable, setApproveUnavailable] = useState(true);
  // const [rejectUnavailable, setRejectUnavailable] = useState(true);
  // const [isSubmitterOrInputter, setIsSubmitterOrInputter] = useState(false);
  const [isReviewerOrApprover, setIsReviewerOrApprover] = useState(false);
  // const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  // const [hasBeenApproved, setHasBeenApproved] = useState(false);
  // const [submitId, setSubmitId] = useState('');
  // const [approveId, setApproveId] = useState('');
  // const [rejectId, setRejectId] = useState('');
  const [cursor, setCursor] = useState('standard');
  const [userFeedback, setUserFeedback] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [visitedWorkFlowProcesses, setVisitedWorkFlowProcesses] = useState<VisitedNode[]>([]);
  const [buttonList, setButtonList] = useState<VisitedNode[]>([]);
  const [currentRole, setCurrentRole] = useState<string[]>([]);
  const [roleButtons, setRoleButtons] = useState<string[]>([]);
  // const [downloadUnavailable, setDownloadUnavailable] = useState(true);
  const [nextStepIdMap, setNextStepIdMap] = useState({});
  const [submissionHasBeen, setSubmissionHasBeen] = useState<string | undefined>(undefined);
  const SubmissionHeader = () => (
    <Paper className="header">
      <Typography variant="h5">Submissions</Typography>
    </Paper>
  );

  let submissionNotes = [];
  const checkBoxColumns = useMemo(
    () => [
      { title: 'Note', field: 'note' },
      { title: 'Updated Date', field: 'updatedDate' },
      { title: 'Updated By', field: 'updatedBy' },
      { title: 'Process', field: 'role' },
    ],
    [],
  );

  const options = useMemo(() => ({ actionsColumnIndex: -1, search: false, showTitle: true }), []);

  const handleNoteChange = (event:ChangeEvent<{ value: string }>) => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };
  const findTheHeadNode = (visitedWorkFlowProcesses:VisitedNode[])=>{
    const refenceMap:any = {};
    for(const visitedWorkFlowProcess of visitedWorkFlowProcesses){
      refenceMap[visitedWorkFlowProcess.statusName] = false
    }
    for(const visitedWorkFlowProcess of visitedWorkFlowProcesses){
      if(visitedWorkFlowProcess.toStatusesName.length >0){
        for(const toStatusesName of visitedWorkFlowProcess.toStatusesName){
          refenceMap[toStatusesName] = true;
        }
      }
    }
    for (let key in refenceMap) {
      if(!refenceMap[key]){
        return key;
      }
    }
  }

  const { submission, submissionNote, submissionNoteHistory } = useSelector(
    state => ({
      submission: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
      submissionNote: selectFactoryRESTResponseTableValues(selectSubmissionNoteStore)(state),
      submissionNoteHistory: selectFactoryRESTResponseTableValues(selectSubmissionNoteHistoryStore)(
        state,
      ),
    }),
    shallowEqual,
  );
  // recursive get the element in a workflow.
  // const getWorkflowTreeByProcessesId = async (root, visited,statusIds) => {
  //   if (root._id){
  //     visited.push(root._id)
  //     statusIds.push(root.statusId)
  //   }
  //   if(!root.to ||root.to.length == 0){
  //     return visited
  //   }
  //   for (const to of root.to){
  //     if(visited.includes(to._id)){
  //       return visited
  //     }
  //     else{
  //       if(to._id){getWorkflowTreeByProcessesId(to, visited,statusIds )}
  //     }
  //   }
  // }

  const roleButtonMap = {
    Viewer: ['Download'],
    Inputter: ['Download', 'inputted'],
    Submitter: ['Download', 'Submitted', 'inputted'],
    'Submission Approver': ['Rejected', 'Approved', 'Reviewed', 'Returned'],
    Reviewer: ['Rejected', 'Approved', 'Reviewed', 'Returned'],
    'Business Admin': ['Submitted', 'inputted', 'Rejected', 'Approved', 'Reviewed', 'Returned'],
  };

  useEffect(() => {
    // @ts-ignore

    if (location.state.detail) {
      workflowController
        .fetchProcessesByWorkflowId(location.state.detail.workflowId)
        .then((workflowProcesses:WorkflowProcess[]) => {
          const promiseQuery2 = [];
          for (const workflowProcess of workflowProcesses) {
            promiseQuery2.push(
              //@ts-ignore
              statusController.fetchStatus(workflowProcess.statusId).then((status:Status | null) => {
                const workflowProcessCopy = cloneDeep(workflowProcess) as VisitedNode;
                workflowProcessCopy.statusName = status?.name || '';
                workflowProcessCopy.toStatusesName = [];
                return workflowProcessCopy;
              }),
            );
          }
          Promise.all(promiseQuery2).then(workflowProcesses => {
            const statusMap:{ [name: string]: string } = {};
            for (const workflowProcess of workflowProcesses) {
              statusMap[workflowProcess._id!] = workflowProcess.statusName;
            }
            const workflowProcessesList = cloneDeep(workflowProcesses)
            for (const workflowProcesses of workflowProcessesList) {
              for (const toStatus of workflowProcesses.to) {
                workflowProcesses.toStatusesName.push(statusMap[toStatus]);
              }
            }
            // determinte which node is head node.
            const headStatusName = findTheHeadNode(workflowProcessesList)
            setVisitedWorkFlowProcesses(workflowProcessesList);
            const buttonArray = workflowProcessesList.filter((ele:VisitedNode)=>ele.statusName!=headStatusName);
            setButtonList(buttonArray);
          });
        });
      setCurrentRole(location.state.detail.permission);
      // if (
      //   // @ts-ignore
      //   location.state.detail.permission.find(
      //     permission =>
      //       permission === 'Submitter' ||
      //       permission === 'Inputter' ||
      //       permission == 'Business Admin',
      //   ) !== undefined
      // )
      //   setIsSubmitterOrInputter(true);
      // if (
      //   // @ts-ignore
      //   location.state.detail.permission.find(
      //     permission =>
      //       permission === 'Reviewer' ||
      //       permission === 'Submission Approver' ||
      //       permission == 'Business Admin',
      //   ) !== undefined
      // )
      //   setIsReviewerOrApprover(true);

      workflowController
        // @ts-ignore
        .fetchProcess(location.state.detail.workflowProcessId)
        .then((workflowProcess:WorkflowProcess | null) => {
          if (workflowProcess !== undefined && workflowProcess !== null)
            workflowProcess.to.forEach((process:any) => {
              const nextStepIdMapCopy: { [index:string]: string } = cloneDeep(nextStepIdMap);
              nextStepIdMapCopy[process.statusId.name] = process._id;
              setNextStepIdMap(nextStepIdMapCopy);
              // switch (process.statusId.name) {
              //   case 'Submitted': {
              //     setSubmitUnavailable(false);
              //     setSubmitId(process._id);
              //     break;
              //   }
              //   case 'Approved': {
              //     setApproveUnavailable(false);
              //     setApproveId(process._id);
              //     break;
              //   }
              //   case 'Rejected': {
              //     setRejectUnavailable(false);
              //     setRejectId(process._id);
              //     break;
              //   }
              // }
            });
        });
    }
    dispatch(SubmissionNoteStore.actions.RECEIVE(''));
  }, [location, dispatch, refresh]);
  useEffect(()=>{
    if (!currentRole) {
      return
    }
    roleSubmissionButtonController.fetchSubmissionButtonByRole(localStorage.getItem('currentRole') || '').then((data:RoleSubmissionButton)=>{
      
      if(data){
        setRoleButtons(data.button)
      }
    })
  },[currentRole])
  useEffect(()=>{
    dispatch(getSubmissionByIdRequest(submissionId));
  }, [submissionId, dispatch])

  useEffect(()=>{
    dispatch(getSubmissionNoteRequest(submission._id));
  }, [submission, dispatch])

  useEffect(() => {
    (async function () {
      try {
        const childrenSubmissions = await SubmissionController.fetchSubmissionByParentId(
          location.state.detail._id,
        );
        if (childrenSubmissions.length > 0) {
          for (const childrenSubmission of childrenSubmissions) {
            const status = await statusController.fetchStatus(childrenSubmission.statusId);
            if (status?.name == 'Submitted') {
              setSubmissionHasBeen(status?.name);
            } else {
              const submission = await SubmissionController.fetchSubmission(
                location.state.detail._id,
              );
              const status = await statusController.fetchStatus(submission?.statusId || '');
              setSubmissionHasBeen(status?.name);
            }
          }
        } else {
          const submission = await SubmissionController.fetchSubmission(location.state.detail._id);
          const status = await statusController.fetchStatus(submission?.statusId || '');
          setSubmissionHasBeen(status?.name);
        }
      } catch (e) {}
    })();
  }, [location, dispatch, refresh]);

  submissionNotes = submissionNoteHistory.filter((note:SubmissionNote) => note.note !== undefined);
  // @ts-ignore
  submissionNotes.forEach(
    // @ts-ignore
    (note:any) => (note.updatedDate = new Date(note.updatedDate).toLocaleDateString('en-US', timeOption)),
  );

  const handleOpenTemplate = () => {
    history.push({
      pathname: `/admin/submission/submissions/${submission._id}`,
      // @ts-ignore
    });
  };

  const backButtonAction = () => {
    history.push({
      pathname: `/submission/dashboard`,
    });
  };

  const UserFeedback = (feedback:string) => {
    setUserFeedback(feedback);
  };

  // decide button display base on current role.
  const handleButtonDisplayByRole = (button:string, role:string[], roleButtons:string[]) => {
    // if (role.length == 0) {
    //   role[0] = 'Business Admin';
    // }
    if(roleButtons.includes(button)){
      
      return false
    }
    return true;

  };
  // decide button display base on current Status
  const handleButtonDisplayByStatus = (button:string, visitedWorkFlowProcesses:VisitedNode[], status:string|undefined) => {
    // the map represent the clickable button
    let StatusAndActions:{ [key: string]: string[] } = {};
    for(const visitedWorkFlowProcess of visitedWorkFlowProcesses){
      StatusAndActions[visitedWorkFlowProcess.statusName] = [];
    }
    if (visitedWorkFlowProcesses.length > 0 && status) {
      // add the possible buttons to each status.
      for (const workFlowProcesses of visitedWorkFlowProcesses) {
        for (const toName of workFlowProcesses.toStatusesName) {
          StatusAndActions[workFlowProcesses.statusName].push(toName)
        }
      }
    }
    if (status && status in StatusAndActions) {
      if (StatusAndActions[status].includes(button)) {
        return false;
      }
      return true;
    }
    return true;
  };
  const handleChangeStatus = async (submission:Submission, submissionNote:SubmissionNote, role:string, newProcessId:string) => {
    const result = await dispatch(
      updateSubmissionStatusRequest(submission, submissionNote, role, newProcessId),
    );

    //@ts-ignore odd warning here
    if (result) {
      if (!role) {
        role = 'ChangeNote';
      }

      setUserFeedback(`${role} successfully !`);
      setRefresh(true);
      setTimeout(function () {
        setRefresh(false);
      }, 500);

      setTimeout(function () {
        setUserFeedback('');
      }, 2000);
    }
  };
  return (
    <div className="submissions" style={{ cursor }}>
      <SubmissionHeader />

      <Paper className="pl-4 pr-4 pb-5 pt-4">
        <Typography variant="h6"> {submission.name} </Typography>
        <div className="submission__label">
          <Typography className="submission__inputTitle"> Note </Typography>
        </div>
        <div className="submission__noteField">
          <TextField
            variant="outlined"
            className="register__field"
            name="passwordConfirm"
            // value={values.passwordConfirm}
            multiline
            onChange={handleNoteChange}
          />
        </div>
        <div className="submission__label">
          <Typography className="submission__inputTitle"> Note History </Typography>
        </div>
        <MaterialTable
          title={userFeedback}
          columns={checkBoxColumns}
          options={options}
          data={submissionNotes}
        />
        <div>
          <Button
            color="primary"
            variant="contained"
            style={{ cursor }}
            size="large"
            onClick={handleOpenTemplate}
          >
            View Document
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ cursor }}
            size="large"
            onClick={() => templateDownloader(submission.name, submission.workbookData)}
            disabled={isReviewerOrApprover}
          >
            Download
          </Button>

          {/* <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={approveUnavailable || !isReviewerOrApprover || hasBeenApproved}
            onClick={() => handleChangeStatus(submission, submissionNote, 'Approved', approveId)}
          >
            Approve
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={rejectUnavailable || !isReviewerOrApprover|| hasBeenApproved}
            onClick={() => {
              backButtonAction();
              handleChangeStatus(submission, submissionNote, 'Rejected', rejectId)
            }}
          >
            Reject
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            disabled={submitUnavailable || !isSubmitterOrInputter||hasBeenSubmitted}
            onClick={() => {
              
              handleChangeStatus(submission, submissionNote, 'Submitted', submitId)
            }}
          >
            Submit
          </Button> */}
          {buttonList.map((status:VisitedNode) => {
            // @ts-ignore
            const buttonDisplayBaseOnRole:boolean = handleButtonDisplayByRole(
              status.statusName,
              currentRole,
              // @ts-ignore
              roleButtons,
            );
            
            const buttonDisplayBaseOnStatus:boolean = handleButtonDisplayByStatus(
              status.statusName,
              visitedWorkFlowProcesses,
              submissionHasBeen,
            );

            return (
              <Button
                color="primary"
                variant="contained"
                size="large"
                key={status.statusName}
                style={{ cursor }}
                disabled={buttonDisplayBaseOnStatus||buttonDisplayBaseOnRole}
                onClick={() => {
                  handleChangeStatus(
                    submission,
                    submissionNote,
                    status.statusName,
                    // @ts-ignore
                    nextStepIdMap[status.statusName],
                  );
                }}
              >
                {status.statusName}
              </Button>
            );
          })}
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            // @ts-ignore
            onClick={() => handleChangeStatus(submission, submissionNote)}
          >
            Change Notes
          </Button>

          <Button size="large" color="primary" variant="contained" onClick={backButtonAction}>
            <ArrowBackIcon></ArrowBackIcon>
            Back
          </Button>

          <div>{userFeedback}</div>
        </div>
      </Paper>
      <a id="download" style={{ display: 'none' }}></a>
    </div>
  );
};

export default EditSubmission;
