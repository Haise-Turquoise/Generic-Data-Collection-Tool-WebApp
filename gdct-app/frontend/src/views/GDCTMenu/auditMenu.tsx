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
import moment from 'moment';
import { NUMBER_UNARY_OPERATORS, numericLiteral } from '@babel/types';

const auditMenu = () => {
  const curUser = localStorage.getItem("currentUser")
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')
  const [auditlogs, setAuditLogs] = useState<AuditLog[] | undefined>(undefined)
  useEffect(() => {
    fetchWithStatus(AuditLogController, setAuditLogs, setStatus)
  }, [])


  //filter out from auditlogs
  let result = auditlogs?.filter(person => (person.user.email == curUser) && (person.activity != "Login")
  && (person.activity != "Logout"));

  result?.sort((a, b) => {
    return new Date(a.updatedAt!).getTime() > new Date(b.updatedAt!).getTime() ? -1 : 1
  });

  const listofURL = [
    {"Program" : "/admin/program"},
    {"Status" : "/admin/status"},
    {"AppConfig" : "/admin/configuration"},
    {"TemplatePackage" : "/admin/template/package"},
    {"AppSysRole" : "/admin/role/appsysrole"},
    {"Organization" : "/admin/organization/org"},
    {"SheetName" : "/admin/sheetName"},
    {"User" : "/admin/user_management"},
    {"AppSys" : "/admin/role/appsystem"},
    {"Workflow" : "/admin/workflow"},
    {"CategoryTree" : "/admin/coa/tree"},
    {"ReportingPeriod" : "/admin/reporting_period"},
    {"AppRoleResource" : "/admin/role/appresource"},
    {"TemplateType" : "/admin/template/type"},
    {"CategoryGroup" : "/admin/coa/group"},
    {"Category" : "/admin/coa/category"},
  ]

  const findUrl = (activity: string) => {
    if(activity != undefined){
      const tmp = listofURL.filter(obj => activity == Object.keys(obj)[0])
      return Object.values(tmp[0])[0];
    }
  }

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
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[0])}</div>
        <div className="rowCell"> <Link to={result == undefined ? "loading": findUrl(result[0]?.moduleName)} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(2)&& <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[1]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[1])}</div>
        <div className="rowCell"> <Link to={result == undefined ? "loading": findUrl(result[1]?.moduleName)} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(3)&& <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[2]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[2])}</div>
        <div className="rowCell"> <Link to={result == undefined ? "loading": findUrl(result[2]?.moduleName)} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(4) && <div className="rowContainer1">
        <div className="rowCell">{result == undefined ? "loading": result[3]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[3])}</div>
        <div className="rowCell"> <Link to={result == undefined ? "loading": findUrl(result[3]?.moduleName)} className="btn btn-primary">Resume</Link> </div>
        </div>}

        {getAuditNum(5) && <div className="rowContainer">
        <div className="rowCell">{result == undefined ? "loading": result[4]?.activity}</div>
        <div className="rowCell">{result == undefined ? "loading": currentTime(result[4])}</div>
        <div className="rowCell"> <Link to={result == undefined ? "loading": findUrl(result[4]?.moduleName)} className="btn btn-primary">Resume</Link> </div>
        </div>}

      </div>
       
    </div>
    );
};

export default auditMenu;