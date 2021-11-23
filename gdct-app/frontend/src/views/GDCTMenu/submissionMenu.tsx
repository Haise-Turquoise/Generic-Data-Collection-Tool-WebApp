import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { Submission } from '../../types/submissions';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import './menuStyle.css';

const SubmissionMenu = () => {
    const dispatch = useDispatch();
    const [readMessage, setMessage] = useState('Loading submissions...');
    const [renderSubmissions, setSubmissions] = useState<Submission[]>([]);

    let { submissions }:{submissions:Submission[]} = useSelector(
        state => ({
        submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
        }),
        shallowEqual,
    )

    if (submissions.length == 0) {
        
        console.log("hit");
        dispatch(getSubmissionsRequest(()=>{setMessage('Nothing to show');}));
    }


    useEffect(()=>{
          setSubmissions(submissions);
        
    },[submissions])

    return(
        <div>
      <p>Welcome back to GDCT</p>
      
      <div className="subDasboard">
        <div className="subDasboardTitle">
          <div className="subleft">Submission Dashboard To-do..</div>
          <div className="subright"> <a style={{color: 'white'}} href='/submission/dashboard'> See more in submission dashboard </a></div>
        </div>
        {
          renderSubmissions.length < 5 ? <div>nothing to show</div> : renderSubmissions.slice(0,5).map((item, i) => {
            if(i % 2 == 0){
              return <div className="rowContainer">
                    <div className="rowCell" style={{width: '35%'}}>{item.name}</div>
                    <div className="rowCell" style={{width: '20%'}}>{item.period}</div>
                    <div className="rowCell" style={{width: '20%'}}>{item.phase}</div>
                    <div className="rowCell" style={{width: '25%'}}>{new Date(item.updatedAt).toLocaleString()}</div>
                   </div>
            }
            return <div className="rowContainer1">
                    <div className="rowCell" style={{width: '35%'}}>{item.name}</div>
                    <div className="rowCell" style={{width: '20%'}}>{item.period}</div>
                    <div className="rowCell" style={{width: '20%'}}>{item.phase}</div>
                    <div className="rowCell" style={{width: '25%'}}>{new Date(item.updatedAt).toLocaleString()}</div>
                   </div>
          })
        }

        
      </div>
       
    </div>
    );
};

export default SubmissionMenu;