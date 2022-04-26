import React, { Fragment , useState} from "react";
import Chart from "react-google-charts";
import SubmissionStatus from '../../types/submissionstatus';
import {FormControl, InputLabel, Select, MenuItem, Grid, Card} from '@material-ui/core';
import './menuStyle.css';

export type BarGroupProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  submissionData: SubmissionStatus[];
};



const BarGroupComponent =  (props:any) => {
  // bounds

  //const [currentPeriod, setCurrentPeriod] = useState(props.submissionData[0]._id.submissionPeriod || '');

  let submissionPeriods = [];
  let dict : any = {};


  for (let i = 0; i< props.submissionData.length; i++){
    if (props.submissionData[i]._id.submissionPeriod){
      submissionPeriods.push(props.submissionData[i]._id.submissionPeriod);
      !(props.submissionData[i]._id.submissionPeriod in dict) && (dict[props.submissionData[i]._id.submissionPeriod] = [])
      dict[props.submissionData[i]._id.submissionPeriod].push([      
        props.submissionData[i]._id.name, 
        props.submissionData[i].countSubmitted, 
        props.submissionData[i].countSubmitted, 
        props.submissionData[i].countUnsubmitted,
        props.submissionData[i].countUnsubmitted, 
      ]);
    }

  }
  //sort by date, so it always will be correct
  if (submissionPeriods)
    submissionPeriods = [ ... new Set(submissionPeriods)].sort(function (a: any, b: any) {return a.localeCompare(b);}).reverse()
  
  const [currentPeriod, setCurrentPeriod] = useState(submissionPeriods[0] || '');

  let fixedData : any = [['Template', 'Submitted', {role: 'annotation'}, 'Unsubmitted', {role: 'annotation'}]]
    .concat(dict[currentPeriod]
      .sort(function (a: any, b: any) {return a[0].localeCompare(b[0]);}));
  console.log(fixedData)
  // update scale output dimensions

  const handleChange = (event: any) => {
    setCurrentPeriod(event.target.value);
    console.log(dict);
  }

  return props.width < 10 ? null : (
    <div className="subDasboard">
      <div className="subDasboardTitle">
        <div className="subleft">Submission Overview</div>
      </div>
      <FormControl fullWidth>
        <Select
                labelId="submission-label"
                id="submission-label"
                value={currentPeriod}
                onChange={handleChange}
                label="SubmissionPeriod"
        >
          {submissionPeriods.map((element, index) => {
            return <MenuItem value={element}>{element} </MenuItem>
          })}
        </Select>
      </FormControl>
      <Chart
        width="100%"
        height="500px"
        chartType="ComboChart"
        loader={<div>Loading Chart</div>}
        data={fixedData}
        
        options={{
          // Material design options
          bar: {
            groupWidth: 40
          },
          seriesType: 'bars',
          chart: {
            title: 'Submission Status Overview',
            subtitle: 'GDCT Submission Tracker',
          },
        }}
      />


  </div>
    
  );
}

export default BarGroupComponent;