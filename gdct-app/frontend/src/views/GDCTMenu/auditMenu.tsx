import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { Submission } from '../../types/submissions';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import './menuStyle.css';
import Menu, { MappedMenu } from '../../types/menu';
import { Button } from 'reactstrap';
import AuditLog from '../../types/auditlog';
import { fetchWithStatus, calculateOptions } from '../../tools/misc';
import AuditLogController from '../../controllers/AuditLog';
import MenuController from '../../controllers/Menu';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { NUMBER_UNARY_OPERATORS, numericLiteral } from '@babel/types';


const menuItemTolist = (fetchedMenuItems : any[]) =>{
  var res = new Map();
  fetchedMenuItems.forEach((x) => {
    if(x.url != undefined){
      res.set(x.name, x.url)
    }

    if(x.items != undefined){
      x.items.forEach((a: any) => {res.set(a.name, a.url)});
    }
  });

  return res;
}

const getUrl = (m:Map<any,any> , activiy_name: String) =>{
  return m.get(activiy_name.substr(activiy_name.indexOf(' ')+1));
}

const auditMenu = () => {
  const curUser = localStorage.getItem("currentUser")
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [auditlogs, setAuditLogs] = useState<AuditLog[] | undefined>(undefined)
  const [menuitems, setMenu] = useState<Map<any, any>| undefined>(undefined)
  useEffect(() => {
    fetchWithStatus(AuditLogController, setAuditLogs, setStatus);
    MenuController.fetch(localStorage.getItem('currentRole') || '').then(x => setMenu(menuItemTolist(x))).catch();
    
  }, [])

 

  //filter out from auditlogs
  let result = auditlogs?.filter(person => (person.user.email == curUser) && (person.activity != "Login")
  && (person.activity != "Logout"));

  result?.sort((a, b) => {
    return new Date(a.updatedAt!).getTime() > new Date(b.updatedAt!).getTime() ? -1 : 1
  });

  const currentTime = (obj: AuditLog) => {
    if(obj != undefined){
      return moment(obj.updatedAt).format("YYYY-MM-DD HH:mm:ss")
    }    
  }

  const getAuditNum = (nums: any) => {
    if(result != undefined){
      return result.length >= nums;
    }
  }

    return(
      
        <div>
      
      <div className="subDasboard">
        <div className="subDasboardTitle">
          <div className="subleft">Jump back in...</div>
        </div>

        {getAuditNum(1) && <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[0]?.activity}</div>
        <div className="rowCell">{result == undefined  ? "loading": currentTime(result[0])}</div>
        <div className="rowCell"> <Link to={result == undefined || menuitems == undefined ? "loading": getUrl(menuitems, result[0]?.activity) || '/'} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(2)&& <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[1]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[1])}</div>
        <div className="rowCell"> <Link to={result == undefined || menuitems == undefined ? "loading": getUrl(menuitems, result[1]?.activity)|| '/'} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(3)&& <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[2]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[2])}</div>
        <div className="rowCell"> <Link to={result == undefined || menuitems == undefined ? "loading": getUrl(menuitems, result[2]?.activity)|| '/'} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(4) && <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[3]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[3])}</div>
        <div className="rowCell"> <Link to={result == undefined || menuitems == undefined ? "loading": getUrl(menuitems, result[3]?.activity)|| '/'} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(5) && <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[4]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[4])}</div>
        <div className="rowCell"> <Link to={result == undefined || menuitems == undefined ? "loading": getUrl(menuitems, result[4]?.activity)|| '/'} className="btn btn-primary">Resume</Link> </div>
        </div>}

      </div>
       
    </div>
    );
};

export default auditMenu;