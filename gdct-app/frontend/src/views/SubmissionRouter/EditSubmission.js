import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import cloneDeep from 'clone-deep';
import { useLocation } from 'react-router-dom';
import MaterialTable from 'material-table';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { makeStyles } from '@material-ui/core/styles';
import { length } from 'file-loader';
import { excelImportHandler, templateDownloader } from '../../tools/misc';
import { getSubmissionNoteRequest } from '../../store/thunks/submissionNote';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import SubmissionController from '../../controllers/submission';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import {
  getSubmissionByIdRequest,
  updateSubmissionStatusRequest,
} from '../../store/thunks/submission';
// import DOWNLOAD from '../../store/reducers/ui/excel/commands/DOWNLOAD';
import { selectSubmissionNoteHistoryStore } from '../../store/SubmissionNoteHistoryStore/selectors';
import workflowController from '../../controllers/workflow';
import statusController from '../../controllers/status';

const timeOption = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const EditSubmission = ({ history }) => {
  const dispatch = useDispatch();
  const [submitUnavailable, setSubmitUnavailable] = useState(true);
  const [approveUnavailable, setApproveUnavailable] = useState(true);
  const [rejectUnavailable, setRejectUnavailable] = useState(true);
  const [isSubmitterOrInputter, setIsSubmitterOrInputter] = useState(false);
  const [isReviewerOrApprover, setIsReviewerOrApprover] = useState(false);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const [hasBeenApproved, setHasBeenApproved] = useState(false);
  const [submitId, setSubmitId] = useState('');
  const [approveId, setApproveId] = useState('');
  const [rejectId, setRejectId] = useState('');
  const [cursor, setCursor] = useState('standard');
  const [userFeedback, setUserFeedback] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [visitStatusNode, setVisitStatusNode] = useState([]);
  const [visitedWorkFlowProcesses, setVisitedWorkFlowProcesses] = useState([]);
  const [currentRole, setCurrentRole] = useState('');
  const [statusAndBannedActions, setStatusAndBannedActions] = useState({});
  // const [downloadUnavailable, setDownloadUnavailable] = useState(true);
  const [nextStepIdMap, setNextStepIdMap] = useState({});
  const [submissionHasBeen, setSubmissionHasBeen] = useState(undefined);
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

  const handleNoteChange = event => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };

  const location = useLocation();

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
    Imputer: ['Download', 'inputted'],
    Submitter: ['Download', 'Submitted', 'inputted'],
    'Submission Approver': ['Rejected', 'Approved', 'Reviewed', 'Returned'],
    Reviewer: ['Rejected', 'Approved', 'Reviewed', 'Returned'],
    'Business Admin': ['Submitted', 'inputted', 'Rejected', 'Approved', 'Reviewed', 'Returned'],
  };

  useEffect(() => {
    // @ts-ignore

    if (location.state.detail) {
      // console.log('detail', location.state.detail)
      workflowController
        .fetchProcessesByWorkflowId(location.state.detail.workflowId)
        .then(workflowProcesses => {
          const promiseQuery1 = [];
          const promiseQuery2 = [];
          for (const workflowProcess of workflowProcesses) {
            promiseQuery1.push(statusController.fetchStatus(workflowProcess.statusId));
            promiseQuery2.push(
              statusController.fetchStatus(workflowProcess.statusId).then(status => {
                const workflowProcessCopy = cloneDeep(workflowProcess);
                workflowProcessCopy.statusName = status.name;
                workflowProcessCopy.toStatusesName = [];
                return workflowProcessCopy;
              }),
            );
          }
          Promise.all(promiseQuery2).then(workflowProcesses => {
            const statusMap = {};
            for (const workflowProcess of workflowProcesses) {
              statusMap[workflowProcess._id] = workflowProcess.statusName;
            }
            const workflowProcessesList = workflowProcesses.filter(ele => {
              return ele.statusName != 'Start' && ele.statusName != 'Unsubmitted';
            });
            for (const workflowProcesses of workflowProcessesList) {
              for (const toStatus of workflowProcesses.to) {
                workflowProcesses.toStatusesName.push(statusMap[toStatus]);
              }
            }
            console.log(workflowProcessesList);
            setVisitedWorkFlowProcesses(workflowProcessesList);
          });
        });
      setCurrentRole(location.state.detail.permission);
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission =>
            permission === 'Submitter' ||
            permission === 'Inputter' ||
            permission == 'Business Admin',
        ) !== undefined
      )
        setIsSubmitterOrInputter(true);
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission =>
            permission === 'Reviewer' ||
            permission === 'Submission Approver' ||
            permission == 'Business Admin',
        ) !== undefined
      )
        setIsReviewerOrApprover(true);
      // check has the submission status.
      // SubmissionController.fetchSubmissionByParentId(location.state.detail._id).then(childrenSubmissions=>{
      //   console.log(childrenSubmissions)
      //   if(childrenSubmissions.length > 0){
      //     let submitted = false;
      //     childrenSubmissions.forEach(childrenSubmission=>{
      //       statusController.fetchStatus(childrenSubmission.statusId).then(status=>{
      //         // check the status is Submitted or not.
      //         if(status.name == 'Submitted'){
      //           setHasBeenSubmitted(true)
      //           setSubmissionHasBeen(status.name)
      //         }
      //         // check the status after the phrase Submitted
      //         else{
      //           SubmissionController.fetchSubmission(location.state.detail._id).then(submission=>{
      //             statusController.fetchStatus(submission.statusId).then(status=>{
      //               console.log(status)
      //               setSubmissionHasBeen(status.name)
      //             })
      //           })
      //         }
      //       })
      //     })
      //   }
      //   // check the status before the phrase Submitted
      //   else{
      //     SubmissionController.fetchSubmission(location.state.detail._id).then(submission=>{
      //       console.log(submission)
      //       statusController.fetchStatus(submission.statusId).then(status=>{
      //         console.log(status)
      //         setSubmissionHasBeen(status.name)
      //       })
      //     })
      //   }

      // })

      workflowController
        // @ts-ignore
        .fetchProcess(location.state.detail.workflowProcessId)
        .then(workflowProcess => {
          if (workflowProcess !== undefined)
            workflowProcess.to.forEach(process => {
              // console.log(process.statusId.name)
              const nextStepIdMapCopy = cloneDeep(nextStepIdMap);
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
    // @ts-ignore
    dispatch(getSubmissionByIdRequest(location.state.detail._id));
    // @ts-ignore
    dispatch(getSubmissionNoteRequest(location.state.detail.parentId));
  }, [location, dispatch, refresh]);

  useEffect(() => {
    (async function () {
      try {
        const childrenSubmissions = await SubmissionController.fetchSubmissionByParentId(
          location.state.detail._id,
        );
        if (childrenSubmissions.length > 0) {
          for (const childrenSubmission of childrenSubmissions) {
            const status = await statusController.fetchStatus(childrenSubmission.statusId);
            if (status.name == 'Submitted') {
              setSubmissionHasBeen(status.name);
            } else {
              const submission = await SubmissionController.fetchSubmission(
                location.state.detail._id,
              );
              const status = await statusController.fetchStatus(submission.statusId);
              setSubmissionHasBeen(status.name);
            }
          }
        } else {
          const submission = await SubmissionController.fetchSubmission(location.state.detail._id);
          const status = await statusController.fetchStatus(submission.statusId);
          setSubmissionHasBeen(status.name);
        }
        // SubmissionController.fetchSubmissionByParentId(location.state.detail._id).then(childrenSubmissions=>{
        //   console.log(childrenSubmissions)
        //   if(childrenSubmissions.length > 0){
        //     let submitted = false;
        //     childrenSubmissions.forEach(childrenSubmission=>{
        //       statusController.fetchStatus(childrenSubmission.statusId).then(status=>{
        //         // check the status is Submitted or not.
        //         if(status.name == 'Submitted'){
        //           setHasBeenSubmitted(true)
        //           setSubmissionHasBeen(status.name)
        //         }
        //         // check the status after the phrase Submitted
        //         else{
        //           SubmissionController.fetchSubmission(location.state.detail._id).then(submission=>{
        //             statusController.fetchStatus(submission.statusId).then(status=>{
        //               console.log(status)
        //               setSubmissionHasBeen(status.name)
        //             })
        //           })
        //         }
        //       })
        //     })
        //   }
        //   // check the status before the phrase Submitted
        //   else{
        //     SubmissionController.fetchSubmission(location.state.detail._id).then(submission=>{
        //       console.log(submission)
        //       statusController.fetchStatus(submission.statusId).then(status=>{
        //         console.log(status)
        //         setSubmissionHasBeen(status.name)
        //       })
        //     })
        //   }

        // })
      } catch (e) {}
    })();
  }, [location, dispatch, refresh]);

  submissionNotes = submissionNoteHistory.filter(note => note.note !== undefined);
  // @ts-ignore
  submissionNotes.forEach(
    note => (note.updatedDate = new Date(note.updatedDate).toLocaleDateString('en-US', timeOption)),
  );

  const handleOpenTemplate = () => {
    history.push({
      pathname: `/admin/submission/submissions/${submission._id}`,
      // @ts-ignore
      state: { detail: location.state.detail },
    });
  };

  const backButtonAction = () => {
    history.push({
      pathname: `/submission/dashboard`,
    });
  };

  const UserFeedback = feedback => {
    setUserFeedback(feedback);
  };

  const handleDownloadWorkbook = () => {
    setUserFeedback('Downloading !');
    setCursor('progress');
    DOWNLOAD(convertStateToReactState(submission.workbookData), UserFeedback);

    setTimeout(function () {
      UserFeedback('Download successfully !');
    }, 2000);

    setCursor('standard');
    setTimeout(function () {
      setUserFeedback('');
    }, 4000);
  };
  // decide button display base on current role.
  const handleButtonDisplayByRole = (button, role, map) => {
    if (role.length == 0) {
      role[0] = 'Business Admin';
    }
    const checkList = map[role[0]];
    if (!checkList.includes(button)) {
      return true;
    }
    return false;
  };
  // decide button display base on current Status
  const handleButtonDisplayByStatus = (button, visitedWorkFlowProcesses, status) => {
    const StatusAndBannedActions = {
      Submitted: ['Submitted', 'Inputted'],
      inputted: ['Inputted', 'Approved', 'Rejected', 'Returned', 'Reviewed'],
      Approved: ['Approved', 'Rejected', 'Submitted', 'Inputted', 'Returned', 'Reviewed'],
      Rejected: ['Approved', 'Rejected', 'Submitted', 'Inputted', 'Returned', 'Reviewed'],
      Reviewed: ['Returned', 'Reviewed', 'Submitted', 'Inputted', 'Approved', 'Rejected'],
      Returned: ['Returned', 'Reviewed', 'Submitted', 'Inputted', 'Approved', 'Rejected'],
    };
    // remove the possible avaiable button from the banned list
    if (visitedWorkFlowProcesses.length > 0 && status) {
      for (const workFlowProcesses of visitedWorkFlowProcesses) {
        if (workFlowProcesses.statusName == status) {
          for (const toName of workFlowProcesses.toStatusesName) {
            const index = StatusAndBannedActions[status].indexOf(toName);
            if (index > -1) {
              StatusAndBannedActions[status].splice(index, 1);
            }
          }
        }
      }
    }
    if (status in StatusAndBannedActions) {
      if (StatusAndBannedActions[status].includes(button)) {
        return true;
      }
      return false;
    }
    return false;
  };
  const handleChangeStatus = async (submission, submissionNote, role, newProcessId) => {
    // setCursor('progress');

    const result = await dispatch(
      updateSubmissionStatusRequest(submission, submissionNote, role, newProcessId),
    );

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
          {visitedWorkFlowProcesses.map(status => {
            const buttonDisplayBaseOnRole = handleButtonDisplayByRole(
              status.statusName,
              currentRole,
              roleButtonMap,
            );
            const buttonDisplayBaseOnStatus = handleButtonDisplayByStatus(
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
                disabled={buttonDisplayBaseOnRole || buttonDisplayBaseOnStatus}
                onClick={() => {
                  handleChangeStatus(
                    submission,
                    submissionNote,
                    status.statusName,
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
