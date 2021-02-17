//Oct 16, 2020
//This file exports a page that users can go in to edit templatate spreadsheet files. 
//Since the application is moving onto using google sheets by opening a new tab, this file is currently not being used.

import React, { useEffect, useCallback, useState, useRef } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button, Chip } from '@material-ui/core';
import templateController from '../../../controllers/template'
import XLSX from "xlsx";

import Spreadsheet from 'x-data-spreadsheet';

import Loading from '../../../components/Loading/Loading';

import {
  updateTemplateExcelRequest,
  getTemplateRequest,
  updateTemplateWorkflowProcess,
} from '../../../store/thunks/template';
// import { Excel } from '../../../components/Excel';

import './Template.scss';
import { selectTemplatesStore } from '../../../store/TemplatesStore/selectors';
import { selectFactoryValueById } from '../../../store/common/REST/selectors';
import workflowController from '../../../controllers/workflow';
import TemplatesStore from '../../../store/TemplatesStore/store';

//import Ssheet from "./SpreadSheet.js";
// import Iframe from 'react-iframe'

const sheetOption = {
  mode: 'edit', // edit | read
  showToolbar: true,
  showGrid: true,
  showContextmenu: true,
  view: {
    height: () => document.documentElement.clientHeight,
    width: () => document.documentElement.clientWidth,
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
}

const TemplatePhases = ({ template }) => {
  const [workflowProcess, setWorkflowProcess] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    if (template)
      workflowController
        .fetchProcess(template.workflowProcessId)
        .then(workflowProcess => setWorkflowProcess(workflowProcess));
  }, [template]);

  const handleClickWorkflow = useCallback(
    processId => {
      dispatch(updateTemplateWorkflowProcess(template._id, processId));
    },
    [template, dispatch],
  );

  return (
    <div className="mb-3 d-flex justify-content-end">
      <Chip className="rounded" color="primary" label="Phase Actions:" />
      {workflowProcess && workflowProcess.to.length ? (
        workflowProcess.to.map(outwardProcess => (
          <Button key={outwardProcess._id} onClick={() => handleClickWorkflow(outwardProcess._id)}>
            {outwardProcess.statusId.name}
          </Button>
        ))
      ) : (
        <Chip className="rounded" color="secondary" label="Finalized" />
      )}
    </div>
  );
};

const xlsxObjectToJson = (wb)=>{
  let out = [];
  wb.SheetNames.forEach(function(name) {
    let o = {name:name, rows:{}};
    let ws = wb.Sheets[name];
    let aoa = XLSX.utils.sheet_to_json(ws, {raw: false, header:1});
    aoa.forEach(function(r, i) {
      let cells = {};
      r.forEach(function(c, j) { cells[j] = ({ text: c }); });
      o.rows[i] = { cells: cells };
    })
    out.push(o);
  });
  return out;
}

const Template = ({
  match: {
    params: { _id },
  },
}) => {
  const dispatch = useDispatch();
  let sheet = undefined;
  const sheetDiv = useRef(null);

  const { template } = useSelector(
    state => ({
      template: selectFactoryValueById(selectTemplatesStore)(_id)(state),
    }),
    shallowEqual,
  );
  
  
  useEffect(()=>{

    if(sheetDiv.current && sheet == undefined){
      sheet = new Spreadsheet("#x-spreadsheet", sheetOption);
      sheet.loadData(template.templateData).reRender();
      window.addEventListener("beforeunload", saveTemplate);
    }
  });
  

  const handleSaveTemplate = useCallback(() => {
    // dispatch(updateTemplateExcelRequest());
    console.log(sheet.getData());
  }, []);

  const saveTemplate = () =>{
    const sheetData = sheet.getData();
    console.log('template', sheet.getData())
    templateController.sheetUpdate(_id, sheetData).then(res=>console.log(res));
  }

  useEffect(() => {
    // If fetch fails, push back to /tempaltes
    dispatch(getTemplateRequest(_id));

    return () => {
      dispatch(TemplatesStore.actions.RESET());
    };
  }, [_id]);

  return template && template.templateData ? (
    <div>
      <TemplatePhases template={template} />
      {/* <Iframe url="https://docs.google.com/spreadsheets/d/1ej_7DQP6EfZ4UcQM2V5tptaTQkDm_jHWKv3yLDyjRAM/edit#gid=0"
        height="580px"
        title="Google Sheet"
        className="w-100 d-flex justify-content-end"
        position="relative"
        /> */}
      {/* <Excel
        type="template"
        returnLink="/template_manager/templates"
        handleSave={handleSaveTemplate}
      /> */}
      <div ref={sheetDiv} id="x-spreadsheet"></div>
      <button onClick={saveTemplate}>Save</button>
    </div>
  ) : (
    <Loading />
  );
};
export default Template;