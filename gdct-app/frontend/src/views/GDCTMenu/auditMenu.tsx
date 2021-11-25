import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { Submission } from '../../types/submissions';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import './menuStyle.css';
import { Button } from 'reactstrap';
import AuditLog from '../../types/auditlog';
import { fetchWithStatus, calculateOptions } from '../../tools/misc';
import AuditLogController from '../../controllers/AuditLog'
import { Link } from 'react-router-dom';
import MenuItem from '../../types/menuitems';
import createUserNavigation from '../../components/AuthPage/createUserNavigation';
import { MappedMenu } from '../../types/menu';

const auditMenu = () => {
  const [config, setConfig] = useState<MappedMenu[]>([]);
  const curUser = localStorage.getItem("currentUser")
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [auditlogs, setAuditLogs] = useState<AuditLog[] | undefined>(undefined)
  useEffect(() => {
    fetchWithStatus(AuditLogController, setAuditLogs, setStatus)
  }, [])

  useEffect(() => {
    createUserNavigation().then((res: MappedMenu[]) => {
      setConfig(res);
    });
  }, []);
  
  console.log("config!!")
  console.log(config)

  // filter out from auditlogs
  let result = auditlogs?.filter(person => (person.user.email == curUser) && (person.activity != "Login")
  && (person.activity != "Logout"));

  result?.sort((a, b) => {
    return new Date(a.updatedAt!).getTime() > new Date(b.updatedAt!).getTime() ? -1 : 1
  });

  // log out filtered auditlog
  console.log(result)

    return(
      
        <div>
      
      <div className="subDasboard">
        <div className="subDasboardTitle">
          <div className="subleft">Jump back in...</div>
    
        </div>
        <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[0].activity}</div>
        <div className="rowCell">{result == undefined ? "loading": new Date(result[0].newValue.updatedAt).toLocaleString()}</div>
        <div className="rowCell"> <Button> Resume </Button> </div>
        </div>
        <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[1].activity}</div>
        <div className="rowCell">{result == undefined ? "loading": (result[1].newValue.updatedAt?.substring(0,10) + " " + result[1].updatedAt?.substring(11,19))}</div>
        <div className="rowCell"> <Link to="/user/profile/personaldetails" className="btn btn-primary">Resume</Link> </div>
        </div>
        <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[2].activity}</div>
        <div className="rowCell">{result == undefined ? "loading": (result[2].newValue.updatedAt?.substring(0,10) + " " + result[2].updatedAt?.substring(11,19))}</div>
        <div className="rowCell"> <Button> Resume </Button> </div>
        </div>
        <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[3].activity}</div>
        <div className="rowCell">{result == undefined ? "loading": (result[3].newValue.updatedAt?.substring(0,10) + " " + result[3].updatedAt?.substring(11,19))}</div>
        <div className="rowCell"> <Button> Resume </Button> </div>
        </div>
        <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[4].activity}</div>
        <div className="rowCell">{result == undefined ? "loading": (result[4].newValue.updatedAt?.substring(0,10) + " " + result[4].updatedAt?.substring(11,19))}</div>
        <div className="rowCell"> <Button> Resume </Button> </div>
        </div>

        
      </div>
       
    </div>
    );
};

export default auditMenu;