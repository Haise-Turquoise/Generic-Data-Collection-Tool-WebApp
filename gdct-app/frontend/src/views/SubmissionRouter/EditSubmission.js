import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { useLocation } from 'react-router-dom';
import MaterialTable from 'material-table';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { excelImportHandler, templateDownloader } from '../../tools/misc';
import { makeStyles } from '@material-ui/core/styles';
import { getSubmissionNoteRequest } from '../../store/thunks/submissionNote';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import SubmissionController from '../../controllers/submission'
import {
  selectFactoryRESTResponseTableValues,
} from '../../store/common/REST/selectors';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import {
  getSubmissionByIdRequest,
  updateSubmissionStatusRequest,
} from '../../store/thunks/submission';
// import DOWNLOAD from '../../store/reducers/ui/excel/commands/DOWNLOAD';
import { selectSubmissionNoteHistoryStore } from '../../store/SubmissionNoteHistoryStore/selectors';
import workflowController from '../../controllers/workflow';

const timeOption = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric' };
import statusController from '../../controllers/status';
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
  const [currentRole, setCurrentRole] = useState('');
  // const [downloadUnavailable, setDownloadUnavailable] = useState(true);
  const [nextStepId, setNextStepId] = useState('')
  const [submissionHasBeen, setSubmissionHasBeen] = useState('');
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
  // recursive get the element in a workflow
  const getWorkflowTreeByProcessesId = async (root, visited,statusIds) => {
    if(root._id){
      visited.push(root._id)
      statusIds.push(root.statusId)
    }
    if(!root.to ||root.to.length == 0){
      return visited
    }
    for (const to of root.to){
      if(visited.includes(to._id)){
        return visited
      }
      else{
        if(to._id){getWorkflowTreeByProcessesId(to, visited,statusIds )}
        // getWorkflowTreeByProcessesId(to, visited)

      }
    }
  }


  const roleButtonMap = {
    'Viewer':['Download'],
    'Imputer': ['Download','inputted'],
    'Submitter':['Download','Submitted','inputted'],
    'Submission Approver':['Rejected', 'Approved','Reviewed','Returned'],
    'Reviewer':['Rejected', 'Approved','Reviewed','Returned']
  }


  useEffect(() => {
    // @ts-ignore
    
    if (location.state.detail) {
      console.log('detail', location.state.detail)
      
      workflowController.fetchProcess(location.state.detail.workflowProcessId).then(root=>{
        let visited = []
        let statusIds = []
        getWorkflowTreeByProcessesId(root, visited, statusIds)
        let statusMap = []
        let promiseQuery = []
        for(const workflowProcess of statusIds){
          if(! workflowProcess.name){
            promiseQuery.push(
              statusController.fetchStatus(workflowProcess).then(status=>{
                return status.name
              })
            )

          }
          else{
            promiseQuery.push(
              statusController.fetchStatus(workflowProcess._id).then(status=>{
                return status.name
              })
            )

          }

        }
      Promise.all(promiseQuery).then(statusMap=>{
        const newStatusMap = statusMap.filter(ele=>{return (ele != 'Start' && ele != 'Unsubmitted')})
        console.log(statusMap)
        // setVisitStatusNode(newStatusMap)
      })
      })
      // workflowController.fetchOnlyWorkflowById('60ae8834a8661d10388da415').then((workflow)=>{
      //   console.log(workflow)
      // })
      workflowController.fetchProcessesByWorkflowId(location.state.detail.workflowId).then((workflowProcesses)=>{
        
        let promiseQuery1 = [];
        for (const workflowProcess of workflowProcesses){
          promiseQuery1.push(statusController.fetchStatus(workflowProcess.statusId))
        }
        
        Promise.all(promiseQuery1).then((statuses)=>{
          // console.log(statuses)
          let statusMap = [];
          for (const status of statuses){
            statusMap.push(status.name)
          }
          statusMap = statusMap.filter(ele=>{return (ele != 'Start' && ele != 'Unsubmitted')})
          console.log(statusMap)
          setVisitStatusNode(statusMap)
        })
        
      })
      setCurrentRole(location.state.detail.permission)
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission => permission === 'Submitter' || permission === 'Inputter'|| permission == "Business Admin",
        ) !== undefined
      )
        setIsSubmitterOrInputter(true);
      if (
        // @ts-ignore
        location.state.detail.permission.find(
          permission => permission === 'Reviewer' || permission === 'Submission Approver'||permission == "Business Admin",
        ) !== undefined
      )
        setIsReviewerOrApprover(true);
        // check has the to-do object has been submitted at this moment
        SubmissionController.fetchSubmissionByParentId(location.state.detail._id).then(childrenSubmissions=>{
          
          if(childrenSubmissions.length > 0){
            let submitted = false;
            childrenSubmissions.forEach(childrenSubmission=>{
              statusController.fetchStatus(childrenSubmission.statusId).then(status=>{
                if(status.name == 'Submitted'){
                  setHasBeenSubmitted(true)
                  setSubmissionHasBeen(status.name)
                }
              })
            })
          }
          
        })
        // check has the submitted object has been approved at this moment
        SubmissionController.fetchSubmission(location.state.detail._id).then(submission=>{
          statusController.fetchStatus(submission.statusId).then(status=>{
            setSubmissionHasBeen(status.name)
            // if(status.name == 'Approved'){
            //   // setHasBeenApproved(true)
            // }

          })
        })
      workflowController
        // @ts-ignore
        .fetchProcess(location.state.detail.workflowProcessId)
        .then(workflowProcess => {
          if (workflowProcess !== undefined)
            
            workflowProcess.to.forEach(process => {
              
              for(const workflowUnit of visitStatusNode){
                if(process.statusId.name == workflowUnit){
                  setNextStepId(process._id)
                }
              }
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


 
  submissionNotes = submissionNoteHistory.filter(note=>note.note !== undefined)
  // @ts-ignore
  submissionNotes.forEach(note => note.updatedDate = new Date(note.updatedDate).toLocaleDateString("en-US", timeOption));


  const handleOpenTemplate = () => {
    history.push({
      pathname: `/admin/submission/submissions/${submission._id}`,  
      // @ts-ignore
      state: { detail: location.state.detail },
    });
  }

  const backButtonAction = () => {
    history.push({

      pathname: `/submission/dashboard`
    })
  }

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
  const handleButtonDisplayByRole = (button,role, map)=>{
    const checkList = map[role[0]];
    if(! checkList.includes(button)){
      return true
    }
    else{
      return false
    }
  }

  const handleButtonDisplayByStatus = (button, status)=>{
    console.log('button',button, 'status', status)
    
    const consistentStatusMap = {
      'Submitted':['Submitted'],
      'inputted':['Inputted'],
      'Approved':['Approved','Rejected'],
      'Rejected':['Approved', 'Rejected'],
      'Reviewed':['Returned', 'Reviewed'],
      'Returned':['Returned', 'Reviewed']
    }
    if(status in consistentStatusMap){
      console.log(status)
      if(consistentStatusMap[status].includes(button)){
        return true
      }
      else{
        return false
      }
    }
    // if(consistentStatusMap[status].includes(button)){
    //   return true
    // }
    else{
      return false
    }
  }
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
  // console.log('button',submitUnavailable , !isSubmitterOrInputter,hasBeenSubmitted)
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
            onClick={()=>templateDownloader(submission.name, submission.workbookData)}
            disabled = {isReviewerOrApprover}
          >
            Download
          </Button>
          
          {/*<Button
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
          </Button>*/}
          {visitStatusNode.map(status=>{
            const buttonDisplayBaseOnRole = handleButtonDisplayByRole(status,currentRole,roleButtonMap)
            const buttonDisplayBaseOnStatus = handleButtonDisplayByStatus(status, submissionHasBeen)
            // console.log(buttonDisplayBaseOnStatus, submissionHasBeen)
            return(
              <Button
            color="primary"
            variant="contained"
            size="large"
            key = {status}
            style={{ cursor }}
            disabled = {buttonDisplayBaseOnRole || buttonDisplayBaseOnStatus}
            onClick={() => {
              
              handleChangeStatus(submission, submissionNote, status, nextStepId)
            }}

          >
            {status}
          </Button>
            )
          })

          }
          <Button
            color="primary"
            variant="contained"
            size="large"
            style={{ cursor }}
            onClick={() => handleChangeStatus(submission, submissionNote)}
          >
            Change Notes
          </Button>



          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={backButtonAction}
          >
            <ArrowBackIcon></ArrowBackIcon>
            Back
          </Button>

          <div>{userFeedback}</div>


        </div>
      </Paper>
      <a id="download" style={{display:'none'}}></a>
    </div>
  );
};

export default EditSubmission;
