import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import React, { ChangeEvent, useCallback, useEffect, useState, useRef, createRef} from 'react';
import Spreadsheet from 'x-data-spreadsheet';
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
import UploadPreview from './uploadPreview';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import objectHash from 'object-hash';








const SubmissionHeader = () => (
  <Paper className="header">
    <Typography variant="h5">Submissions</Typography>
  </Paper>
);




const sheetOption = { 
  mode: 'read', // edit | read
  showToolbar: false,
  showGrid: true,
  showContextmenu: false,
  view: {
    height: () => document.documentElement.clientHeight * 0.86,
    width: () => document.documentElement.clientWidth * 0.975,
  },
  row: {
    len: 100,
    height: 25,
  },
  col: {
    len: 26,
    width: 100,
    indexWidth: 60,
    minWidth: 60,
  },
  style: {
    bgcolor: '#ffffff',
    align: 'left',
    valign: 'middle',
    textwrap: false,
    strike: false,
    underline: false,
    color: '#0a0a0a',
    font: {
      name: 'Helvetica',
      size: 10,
      bold: false,
      italic: false,
    },
  },
} as any ;


const CreateSubmission = ({ history }: RouterProps) => {
  
  //  const [workflowProcess, setWorkflowProcess] = useState()
  const inputEl = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const [showSave, setSave] = useState<'visible' | 'hidden'>('hidden');
  const [message, setMessage] = useState('hidden');
  const [messageColour, setMessageColour] = useState('green');
  const [csvInput, setCsvInput] = useState<boolean>(false);
  const [xlsxInput, setXlsxInput] = useState<boolean>(false);
  const [buttoncolor, setbuttoncolor] = useState<"inherit" | "primary" | "secondary" | "default">("default");
  const [sheetUpdate, setSheetUpdate] = useState<string | undefined>('All');
  //const [sheet,setSheet] = useState<any>(null)
  const datasheet = createRef<any>();
  const [prevSubmission, setPrevSubmission] = useState<any>((history.location.state as any).detail);

  

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
      
      if(rows[key].cells != undefined && rows[key].cells[0].text != undefined && rows[key].cells[0].text === id){
        return key
      }
    }

    return null;
  }

  const updateWorkbook = (csvArray: any, sheetName?: string) =>{
    
    
    var workData = prevSubmission.workbookData;
    var test_Index = 0;
    for(var key in workData){
      if(workData[key].name == sheetName){
        test_Index = Number(key);
      }
    }

    console.log(workData)
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
          
        }
        // else{
        //   console.log("hit the wrong spot")
        // }
      }
    });

    setPrevSubmission(prevSubmission)
    
    
  }
  
  const handleXlsFile  = async (event: any) =>{
    
    excelImportHandler(event, (workBookData: any) => {
      prevSubmission.workbookData = workBookData;
      setPrevSubmission(prevSubmission);
      console.log(prevSubmission);
      setXlsxInput(true);
      setbuttoncolor("primary");
    });
  }

  const handleCSVFile = async (event: any) =>{
    console.log(prevSubmission)
    if(inputEl.current?.files){
      let file = inputEl.current.files.item(0);
      if(file){
        var sheetName = file.name.split('_').at(-1)?.split('.csv')[0];
        console.log("PPPPPPP")
        console.log(sheetName)
        setSheetUpdate(sheetName);
        var text = await file.text()
        var split_text = text.split('\n');
        updateWorkbook(split_text, sheetName);
        setCsvInput(true);
        setbuttoncolor("primary");
        
      }
    }
    
  }

  const uploadFile = async (event: any) =>{
    console.log(prevSubmission)
    submissionController.validateAndUpdate(prevSubmission,submissionNote,sheetUpdate).then(res =>{
      console.log(res.data)
      if(res.data.errors != undefined){
        setSave('visible');
        setMessage('submission was invalid');
        setMessageColour('red');
      }

      
      else if(res.data.submission != undefined){
        setPrevSubmission(res.data.submission)
        datasheet.current.update()
        setSave('visible');
        setMessage('Sucessfully uplaoded to database');
        setMessageColour('green');
      }
      
    })
      
     
      
    
    
  
}

  const backButtonAction = () => {
    history.push({
      pathname: `/submission/dashboard`,
    });
  };

  const handleCreateSubmission = () =>{
    console.log(prevSubmission)
    submissionController
    .updateWorkbook(prevSubmission, submissionNote)
  }


  return (
    <div className="submissions">
      <SubmissionHeader />
      <Paper className="pl-4 pr-4 pb-5 pt-4">
      <Button className="submission_upload_button">
        upload xlsx
        <input type="file" disabled={csvInput} onChange={handleXlsFile} />
      </Button>
        <Button className="submission_csv_upload_button">
          upload csv
          
          <input type="file"  accept=".csv" disabled={xlsxInput} ref={inputEl} onChange ={handleCSVFile} />
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
          {/* <Button
            color="primary"
            variant="contained"
            size="large"
            disabled={
              location.state.detail.phase === 'Submitted' ||
              location.state.detail.phase === 'Approved'
            }
            onClick={() => {
              try {
                handleCreateSubmission();
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
          </Button> */}
          
            <Button
              color= {buttoncolor}
              variant="contained"
              size="large"
              disabled={csvInput === false && xlsxInput === false}
              onClick={uploadFile}
            >
              Upload 
            </Button>

          
          

          <div style={{ visibility: showSave, color: messageColour, fontSize: 16 }}>
            <DoneIcon />
            <Typography>{message}</Typography>
          </div>
        </div>
      </Paper>
      <div style={{fontSize:25}}>PREVIEW</div>
      {csvInput || xlsxInput ? <UploadPreview  ref={datasheet} submission={prevSubmission}/> : <div></div>}
    </div>

    

  );
};

export default CreateSubmission;
