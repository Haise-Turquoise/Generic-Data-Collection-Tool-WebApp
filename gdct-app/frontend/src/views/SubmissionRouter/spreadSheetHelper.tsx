const spreadsheetLinksInitialize = (sheet: any) =>{
    const mainMenu = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
      
    //clear and reload the table of contents in the main menu
    for (let i = 0; i < 25; i++){
        mainMenu.setCellText(0, i, "");
      }
      sheet.reRender();
      for (let i = 0; i < sheet.datas.length; i++){
        mainMenu.setCellText(i+8, 1, sheet.datas[i].name);
        mainMenu.rows._[i + 8].cells[1].style = 0;
      }
      sheet.reRender();

    //whenever the user clicks on a cell, check if it is a link
    sheet.on('cell-selected', (cell:any, ri:any, ci:any) => {
        console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
        //this one is used for the return to main menu link on the identification
        if (ri === 12 && ci === 5 && sheet.getCurrentSheetIndex() === 1)
            sheet.bottombar.clickSwap2(sheet.bottombar.items[0])
        // if (ri === 7 && ci === 1 && sheet.getCurrentSheetIndex() !== 0)
        //     sheet.bottombar.clickSwap2(sheet.bottombar.items[0])

        //this one is used for the links in the main menu
        for (let i = 0; i< sheet.datas.length; i++){
            if (ri === i+8 && ci === 1 && sheet.getCurrentSheetIndex() === 0)
            sheet.bottombar.clickSwap2(sheet.bottombar.items[i])
        }
    })
    //whenever the user switches tabs on the bottom, use this sequence to refresh
    sheet.bottombar.on('bottom-shift',()=>{
        console.log("shifting my ")
        const mainMenu3 = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
        
        //clear all the cells first
        for (let i = 0; i < 25; i++){
            mainMenu3.setCellText(i, 9, "");
        }
        sheet.reRender();

        //set the cells here to the names of the tabs
        for (let i = 0; i < sheet.datas.length; i++){
            mainMenu3.setCellText(i+8, 1, sheet.datas[i].name);
            mainMenu3.rows._[i + 8].cells[1].style = 0;
        }
        sheet.reRender();
    }) 
    sheet.reRender();
}

export default spreadsheetLinksInitialize;