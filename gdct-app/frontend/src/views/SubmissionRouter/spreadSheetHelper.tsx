const spreadsheetLinksInitialize = (sheet: any) =>{
    sheet.on('cell-selected', (cell:any, ri:any, ci:any) => {
        console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
        //this one is used for the return to main menu link on the identification
        if (ri === 12 && ci === 5 && sheet.getCurrentSheetIndex() === 1)
          sheet.bottombar.clickSwap2(sheet.bottombar.items[0]);

        //this one is used for the links in the main menu
        
        const mainMenu3 = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
        if (sheet.getCurrentSheetIndex() === 0 && mainMenu3.styles[cell.style].underline === true){
          const sheetNames = sheet.bottombar.dataNames;
          for (const name of sheetNames){
            if (cell.text.includes(name))
              sheet.bottombar.clickSwap2(sheet.bottombar.items[sheetNames.indexOf(name)]);
          }
          
        }
      })
}

export default spreadsheetLinksInitialize;