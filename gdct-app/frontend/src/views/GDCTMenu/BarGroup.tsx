import React, { Fragment , useState} from "react";
import Chart from "react-google-charts";
import SubmissionStatus from '../../types/submissionstatus';
import {FormControl, InputLabel, Select, MenuItem, Grid, Card} from '@material-ui/core';


export type BarGroupProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  submissionData: SubmissionStatus[];
};


const blue = "#aeeef8";
const green = "#e5fd3d";
export const background = "#612efb";


const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };




const BarGroupComponent =  (props:any) => {
  // bounds

  const [currentPeriod, setCurrentPeriod] = useState(props.submissionData[0]._id.submissionPeriod);

  let submissionPeriods = [];
  let dict : any = {};
  console.log("ll");
  console.log(props.submissionData);

  for (let i = 0; i< props.submissionData.length; i++){
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
  //sort by date, so it always will be correct


  let fixedData : any = [['Template', 'Submitted', {role: 'annotation'}, 'Unsubmitted', {role: 'annotation'}]].concat(dict[currentPeriod]);
 
  // update scale output dimensions

  const handleChange = (event: any) => {
    setCurrentPeriod(event.target.value);
    console.log(dict);
  }

  return props.width < 10 ? null : (
    <Fragment>

      <Grid 
        item
        xs={12}
        style={{ display: "flex", gap: "1rem", alignItems: "center", height: '100%'}}
        >
        <Grid item >
        <FormControl fullWidth>
          <InputLabel id="submission-label">Submission Period</InputLabel>
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
          width={'500px'}
          height={'300px'}
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


        </Grid>
      </Grid>
     
    </Fragment>


  );
}

export default BarGroupComponent;