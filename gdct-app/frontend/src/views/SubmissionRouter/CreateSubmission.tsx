import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { ChangeEvent, useCallback, useEffect, useState, useRef} from 'react';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { RouterProps, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper/Paper';
import DoneIcon from '@material-ui/icons/Done';
//@ts-ignore
import { excelImportHandler } from '../../tools/misc';
import SubmissionNoteStore from '../../store/SubmissionNoteStore/store';
import SubmissionWorkbookStore from '../../store/SubmissionWorkbookStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { selectSubmissionNoteStore } from '../../store/SubmissionNoteStore/selectors';
import { selectSubmissionWorkbookStore } from '../../store/SubmissionWorkbookStore/selectors';
import { updateWorkbookRequest } from '../../store/thunks/submission';
import submissionController from '../../controllers/submission';

const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
  </Paper>
);

const FileUpload = () => {
  const dispatch = useDispatch();
  const handleChange = useCallback(
    async event => {
      excelImportHandler(event, (workBookData: any) => {
        dispatch(SubmissionWorkbookStore.actions.RECEIVE(workBookData));
      });
    },
    [dispatch],
  );

  return (
    <Button className="submission_upload_button">
      
      <input type="file" onChange={handleChange} />
    </Button>
  );
};



const CreateSubmission = ({ history }: RouterProps) => {
  //  const [workflowProcess, setWorkflowProcess] = useState()
  const inputEl = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [showSave, setSave] = useState<'visible' | 'hidden'>('hidden');
  const [message, setMessage] = useState('hidden');
  const [messageColour, setMessageColour] = useState('green');
  const [prevSubmission, setPrevSubmission] = useState<any>(undefined);

  

  const handleNoteChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(event.target.value));
  };
  console.log("lool")
  console.log(history.location.state);

  const location = useLocation<{ detail: { phase: string }}>();

  useEffect(() => {
    dispatch(SubmissionNoteStore.actions.RECEIVE(''));
  }, [location]);

  const {submissionNote, submissionWorkbook } = useSelector(
    state => ({
      
      submissionNote: selectFactoryRESTResponseTableValues(selectSubmissionNoteStore)(state),
      submissionWorkbook: selectFactoryRESTResponseTableValues(selectSubmissionWorkbookStore)(
        state,
      ),
    }),
    shallowEqual,
  );

  
  const findAttirbuteCol= (rows: any,id:string | undefined) => {

    var search_row = rows[0].cells;

    for(var key in search_row){
      if(search_row[key].text != undefined && search_row[key].text === id){
        return key;
      }
    }
    return null
  }

  const findColrow = (rows: any,id:string | undefined) => {
    for(var key in rows){
      if(rows[key].cells[0].text != undefined && rows[key].cells[0].text === id){
        return key
      }
    }

    return null;
  }

  const updateWorkbook = (csvArray: any) =>{
    
    var x =  history.location.state as any;
    var sub = x.detail;
    var workData = x.detail.workbookData;
    var test_Index = 0;
    for(var key in workData){
      if(workData[key].name == "Balance Sheet"){
        test_Index = Number(key);
      }
    }
    var rowsData = workData[test_Index].rows; 

    csvArray.forEach((element: string) => {
      let values = element.split(',');
      //console.log(values);
      let catId = values.at(-3);
      let attId = values.at(-2);
      let val = values.at(-1);
      if(val != 'n/a' && val != 'value' && val != ''){
        let catRowNum = findColrow(rowsData,catId);
        let attColNum = findAttirbuteCol(rowsData,attId);

        if(catRowNum != null && attColNum != null){
          rowsData[catRowNum].cells[attColNum].text = val
          console.log("hiiiiit")
          console.log("val: " + val +" row: " +catRowNum+ " col: "+ attColNum);
        }
        else{
          console.log("hit the wrong spot")
        }
      }
    });

    console.log(sub)
    
    submissionController.validateAndUpdate(sub);
  }
  
  //updateWorkbook();

  

  const handleCSVFile = async (event: any) =>{
    if(inputEl.current?.files){
      let file = inputEl.current.files.item(0);
      if(file){
        var text = await file.text()
        var split_text = text.split('\n');
        updateWorkbook(split_text);
      }
    }
    
  }

  const backButtonAction = () => {
    history.push({
      pathname: `/submission/dashboard`,
    });
  };

  const handleCreateSubmission = useCallback(
    (submissionNote, submissionWorkbook) =>
    //TODO need help on this
    //@ts-ignore
      dispatch(updateWorkbookRequest(submissionNote, submissionWorkbook, location.state.detail)),
    [dispatch],
  );

  return (
    <div className="submissions">
      <SubmissionHeader />
      <Paper className="pl-4 pr-4 pb-5 pt-4">
        <FileUpload />
        <Button className="submission_csv_upload_button">
          upload csv 
          <input type="file"  accept=".csv" ref={inputEl}  />
        </Button>
        <br />
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

        <div style={{ display: 'flex', verticalAlign: 'middle' }}>
          <Button size="large" color="primary" variant="contained" onClick={backButtonAction}>
            <ArrowBackIcon></ArrowBackIcon>
            Back
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={
              location.state.detail.phase === 'Submitted' ||
              location.state.detail.phase === 'Approved'
            }
            onClick={() => {
              try {
                handleCreateSubmission(submissionNote, submissionWorkbook);
                setSave('visible');
                setMessage('Sucessfully Saved!');
                setMessageColour('green');
              } catch (e) {
                setSave('visible');
                setMessage('Fail to save workbook');
                setMessageColour('red');
              }
            }}
          >
            Upload
          </Button>

          <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={
              location.state.detail.phase === 'Submitted' ||
              location.state.detail.phase === 'Approved'
            }
            onClick={handleCSVFile}
          >
            Upload CSV
          </Button>

          <div style={{ visibility: showSave, color: messageColour, fontSize: 16 }}>
            <DoneIcon />
            <Typography>{message}</Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default CreateSubmission;
