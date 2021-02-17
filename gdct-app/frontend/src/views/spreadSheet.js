import React, { useEffect, useRef } from 'react';
import Spreadsheet from 'x-spreadsheet';


const spreadSheetModule = (template)=>{
    const spreadSheetDiv = useRef(null);
    let sheet = null;
    useEffect(()=>{
        if (spreadSheetDiv.current){
            sheet = new Spreadsheet("#x-spreadsheet");
            sheet.loadData(template.templateData).reRender()
        }
    }, [spreadSheetDiv.current])
    return (
        <div>
            <div ref={spreadSheetDiv} id="x-spreadsheet"></div>
        </div>
    )
}