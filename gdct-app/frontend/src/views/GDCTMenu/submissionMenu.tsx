import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';

import { getSubmissionsRequest } from '../../store/thunks/submission';
import SubmissionStatusController from '../../controllers/SubmissionStatus';
import usersController from '../../controllers/Users';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { calculateOptions, sysRoleTraversal, formatTimestamp } from '../../tools/misc';
import submissionController from '../../controllers/submission';
import Submission, { SubmissionPopulated } from '../../types/submission';


import './menuStyle.css';


const SubmissionMenu = () => {
    const currUID = localStorage.getItem('currentUserID');
    const dispatch = useDispatch();
    const [readMessage, setMessage] = useState('Loading submissions...');
    const [renderSubmissions, setSubmissions] = useState<SubmissionPopulated[]>([]);

 


    useEffect(()=>{
      if (!currUID) {
        return
      }
      (async function() {
        const sysRole = (await usersController.fetchById(currUID))?.sysRole
        let parsed = sysRoleTraversal(sysRole || [])
        // we are only concerned with roles that match current selected user role
        // ex someone who is Submitter + Approver should only see whichever they signed in to
        parsed = parsed.filter(role => role.role === localStorage.getItem('currentRole'))

        await SubmissionStatusController.createByRoles(parsed, currUID)
        // for finding submissions
        let submissions = await submissionController.fetchByRole(parsed)
        // filter to latest submissions
        submissions = submissions.filter(sub => sub.isLatest)
        // temporary fix for duplicates
        submissions = submissions.reduce((unique: SubmissionPopulated[], current: SubmissionPopulated) => {
          const found = unique.find(uniqueSub => current.name === uniqueSub.name)
          return !!found ? unique : [...unique, current]
        }, [])

        console.log("heehehehehe");
        console.log(submissions);

        setSubmissions(submissions)
      })()
        
    },[])

    return(
        <div>
      <p>Welcome back to GDCT</p>

      
      <div className="subDasboard">
        <div className="subDasboardTitle">
          <div className="subleft">Submission Dashboard To-do..</div>
          <div className="subright"> <a style={{color: 'white'}} href='/submission/dashboard'> See more in submission dashboard </a></div>
        </div>
        {
          renderSubmissions.length < 1 ? <div>Loading...</div> : renderSubmissions.slice(0,5).map((item, i) => {
            if(i % 2 == 0){
              return <div className="rowContainer">
                    <div className="rowCellSub" style={{width: '35%'}}>{item.name}</div>
                    <div className="rowCellSub" style={{width: '20%'}}>{item.submissionPeriodId.name}</div>
                    <div className="rowCellSub" style={{width: '20%'}}>{item.statusId.name }</div>
                    <div className="rowCellSub" style={{width: '25%'}}>{new Date(item.updatedAt).toLocaleString()}</div>
                   </div>
            }
            return <div className="rowContainer1">
                    <div className="rowCellSub" style={{width: '35%'}}>{item.name}</div>
                    <div className="rowCellSub" style={{width: '20%'}}>{item.submissionPeriodId.name}</div>
                    <div className="rowCellSub" style={{width: '20%'}}>{item.statusId.name }</div>
                    <div className="rowCellSub" style={{width: '25%'}}>{new Date(item.updatedAt).toLocaleString()}</div>
                   </div>
          })
        }

        
      </div>
       
    </div>

    );
};

export default SubmissionMenu;