const spreadsheetInitialize = (sheet: any) =>{
    const mainMenu = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
      const identification = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'IDENTIFICATION');
      if (!mainMenu){
        sheet.addSheet("Main Menu")
        const mainMenu2 = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'MAIN MENU');
        mainMenu2.setCellText(4, 1, "Year:", 'finished');
        mainMenu2.setCellText(5, 1, "Quarter:", 'finished');
      }
      if (!identification){
        sheet.addSheet("Identification")
        const identification2 = sheet.datas.find((datas: any) => datas.name.toUpperCase() == 'IDENTIFICATION');
        identification2.styles.push({color: "#FF0000"}) ;
        sheet.reRender();
        identification2.styles.push({bgcolor: "#E3EFD9", 
          border: {
            "bottom": [
                "thin",
                "#000"
            ],
            "top": [
                "thin",
                "#000"
            ],
            "left": [
                "thin",
                "#000"
            ],
            "right": [
                "thin",
                "#000"
            ]
          }, 
            align: "center",
            font: {
              "bold": true
          }
        })
        identification2.styles.push({
          color: "#01b0f1",
          underline: "true"
        });
        sheet.addSheet("Sheet 1")
        sheet.reRender();

        //this is part of the first column, column 5
        identification2.setCellText(7,5, "0", 'finished')
        identification2.setCellText(8,5, "Hospital Name: #FACILITY_NAME", 'finished')
        identification2.setCellText(9,5, "-", 'finished')
        identification2.setCellText(11,5, "Hospital Identification Form", 'finished')
        identification2.setCellText(12,5, "Return to Main Menu", 'finished')
        identification2.setCellText(13,5, "Description", 'finished')
        identification2.setCellText(14,5, "*Facility No.", 'finished')
        identification2.setCellText(15,5, "*Recipient # (IFIS #)", 'finished')
        identification2.setCellText(16,5, "Period", 'finished')
        identification2.setCellText(17,5, "*LHIN Name", 'finished')
        identification2.setCellText(18,5, "*Hospital Name", 'finished')
        identification2.setCellText(19,5, "*Hospital Legal Name", 'finished')
        // 
        identification2.setCellText(21,5, "Service Provider Address", 'finished')
        identification2.setCellText(22,5, "*Address 1", 'finished')
        identification2.setCellText(23,5, "Address 2", 'finished')
        identification2.setCellText(24,5, "*City", 'finished')
        identification2.setCellText(25,5, "*Postal Code", 'finished')
        //
        identification2.setCellText(27,5, "Chief Financial Officer", 'finished')
        identification2.setCellText(28,5, "*Name", 'finished')
        identification2.setCellText(29,5, "*Position Name", 'finished')
        identification2.setCellText(30,5, "*Telephone", 'finished')
        identification2.setCellText(31,5, "*Email", 'finished')
        //
        identification2.setCellText(33,5, "Finance Contact", 'finished')
        identification2.setCellText(34,5, "*Name", 'finished')
        identification2.setCellText(35,5, "*Position Name", 'finished')
        identification2.setCellText(36,5, "*Telephone", 'finished')
        identification2.setCellText(37,5, "*Email", 'finished')
        //
        identification2.setCellText(39,5, "Board Chair/Signing Authority", 'finished')
        identification2.setCellText(40,5, "*Name", 'finished')
        identification2.setCellText(41,5, "*Position Name", 'finished')
        identification2.setCellText(42,5, "*Telephone", 'finished')
        identification2.setCellText(43,5, "*Email", 'finished')
        //
        identification2.setCellText(45,5, "Board Chair/Signing Authority (if required)", 'finished')
        identification2.setCellText(46,5, "Name", 'finished')
        identification2.setCellText(47,5, "Position Name", 'finished')
        identification2.setCellText(48,5, "Telephone", 'finished')
        identification2.setCellText(49,5, "Email", 'finished')

        //following is for line numbers 
        identification2.setCellText(13,6, "Line#", 'finished')
        identification2.setCellText(14,6, "1", 'finished')
        identification2.setCellText(15,6, "2", 'finished')
        identification2.setCellText(16,6, "3", 'finished')
        identification2.setCellText(17,6, "4", 'finished')
        identification2.setCellText(18,6, "5", 'finished')
        identification2.setCellText(19,6, "6", 'finished')

        identification2.setCellText(22,6, "7", 'finished')
        identification2.setCellText(23,6, "8", 'finished')
        identification2.setCellText(24,6, "9", 'finished')
        identification2.setCellText(25,6, "10", 'finished')

        identification2.setCellText(28,6, "11", 'finished')
        identification2.setCellText(29,6, "12", 'finished')
        identification2.setCellText(30,6, "13", 'finished')
        identification2.setCellText(31,6, "14", 'finished')

        identification2.setCellText(34,6, "15", 'finished')
        identification2.setCellText(35,6, "16", 'finished')
        identification2.setCellText(36,6, "17", 'finished')
        identification2.setCellText(37,6, "18", 'finished')

        identification2.setCellText(40,6, "19", 'finished')
        identification2.setCellText(41,6, "20", 'finished')
        identification2.setCellText(42,6, "21", 'finished')
        identification2.setCellText(43,6, "22", 'finished')

        identification2.setCellText(46,6, "23", 'finished')
        identification2.setCellText(47,6, "24", 'finished')
        identification2.setCellText(48,6, "25", 'finished')
        identification2.setCellText(49,6, "26", 'finished')

        //following is for user inputs column
        identification2.setCellText(13,7, "Details", 'finished')

        //styles set here
        //red 
        identification2.rows._[7].cells[5].style = 0;
        identification2.rows._[8].cells[5].style = 0;
        identification2.rows._[9].cells[5].style = 0;
        identification2.rows._[14].cells[5].style = 0;
        identification2.rows._[15].cells[5].style = 0;
        identification2.rows._[17].cells[5].style = 0;
        identification2.rows._[18].cells[5].style = 0;
        identification2.rows._[19].cells[5].style = 0;

        identification2.rows._[22].cells[5].style = 0;
        identification2.rows._[24].cells[5].style = 0;
        identification2.rows._[25].cells[5].style = 0;

        identification2.rows._[28].cells[5].style = 0;
        identification2.rows._[29].cells[5].style = 0;
        identification2.rows._[30].cells[5].style = 0;
        identification2.rows._[31].cells[5].style = 0;

        identification2.rows._[34].cells[5].style = 0;
        identification2.rows._[35].cells[5].style = 0;
        identification2.rows._[36].cells[5].style = 0;
        identification2.rows._[37].cells[5].style = 0;

        identification2.rows._[40].cells[5].style = 0;
        identification2.rows._[41].cells[5].style = 0;
        identification2.rows._[42].cells[5].style = 0;
        identification2.rows._[43].cells[5].style = 0;

        //column headers
        identification2.rows._[13].cells[5].style = 1;
        identification2.rows._[13].cells[6].style = 1;
        identification2.rows._[13].cells[7].style = 1;

        identification2.rows._[12].cells[5].style = 2;


        identification2.cols._[5] = {width: 307}
        identification2.cols._[7] = {width: 307}
        sheet.on('cell-selected', (cell:any, ri:any, ci:any) => {
          console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
          sheet.bottombar.clickSwap2(sheet.bottombar.items[0])
        })
        sheet.reRender();
      }

      identification.setCellText(7,5, "0", 'finished')
      identification.setCellText(8,5, "Hospital Name: #FACILITY_NAME", 'finished')
      identification.setCellText(9,5, "-", 'finished')
      identification.setCellText(11,5, "Hospital Identification Form", 'finished')
      identification.setCellText(12,5, "Return to Main Menu", 'finished')
      identification.setCellText(13,5, "Description", 'finished')
      identification.setCellText(14,5, "*Facility No.", 'finished')
      identification.setCellText(15,5, "*Recipient # (IFIS #)", 'finished')
      identification.setCellText(16,5, "Period", 'finished')
      identification.setCellText(17,5, "*LHIN Name", 'finished')
      identification.setCellText(18,5, "*Hospital Name", 'finished')
      identification.setCellText(19,5, "*Hospital Legal Name", 'finished')
      // 
      identification.setCellText(21,5, "Service Provider Address", 'finished')
      identification.setCellText(22,5, "*Address 1", 'finished')
      identification.setCellText(23,5, "Address 2", 'finished')
      identification.setCellText(24,5, "*City", 'finished')
      identification.setCellText(25,5, "*Postal Code", 'finished')
      //
      identification.setCellText(27,5, "Chief Financial Officer", 'finished')
      identification.setCellText(28,5, "*Name", 'finished')
      identification.setCellText(29,5, "*Position Name", 'finished')
      identification.setCellText(30,5, "*Telephone", 'finished')
      identification.setCellText(31,5, "*Email", 'finished')
      //
      identification.setCellText(33,5, "Finance Contact", 'finished')
      identification.setCellText(34,5, "*Name", 'finished')
      identification.setCellText(35,5, "*Position Name", 'finished')
      identification.setCellText(36,5, "*Telephone", 'finished')
      identification.setCellText(37,5, "*Email", 'finished')
      //
      identification.setCellText(39,5, "Board Chair/Signing Authority", 'finished')
      identification.setCellText(40,5, "*Name", 'finished')
      identification.setCellText(41,5, "*Position Name", 'finished')
      identification.setCellText(42,5, "*Telephone", 'finished')
      identification.setCellText(43,5, "*Email", 'finished')
      //
      identification.setCellText(45,5, "Board Chair/Signing Authority (if required)", 'finished')
      identification.setCellText(46,5, "Name", 'finished')
      identification.setCellText(47,5, "Position Name", 'finished')
      identification.setCellText(48,5, "Telephone", 'finished')
      identification.setCellText(49,5, "Email", 'finished')

      //following is for line numbers 
      identification.setCellText(13,6, "Line#", 'finished')
      identification.setCellText(14,6, "1", 'finished')
      identification.setCellText(15,6, "2", 'finished')
      identification.setCellText(16,6, "3", 'finished')
      identification.setCellText(17,6, "4", 'finished')
      identification.setCellText(18,6, "5", 'finished')
      identification.setCellText(19,6, "6", 'finished')

      identification.setCellText(22,6, "7", 'finished')
      identification.setCellText(23,6, "8", 'finished')
      identification.setCellText(24,6, "9", 'finished')
      identification.setCellText(25,6, "10", 'finished')

      identification.setCellText(28,6, "11", 'finished')
      identification.setCellText(29,6, "12", 'finished')
      identification.setCellText(30,6, "13", 'finished')
      identification.setCellText(31,6, "14", 'finished')

      identification.setCellText(34,6, "15", 'finished')
      identification.setCellText(35,6, "16", 'finished')
      identification.setCellText(36,6, "17", 'finished')
      identification.setCellText(37,6, "18", 'finished')

      identification.setCellText(40,6, "19", 'finished')
      identification.setCellText(41,6, "20", 'finished')
      identification.setCellText(42,6, "21", 'finished')
      identification.setCellText(43,6, "22", 'finished')

      identification.setCellText(46,6, "23", 'finished')
      identification.setCellText(47,6, "24", 'finished')
      identification.setCellText(48,6, "25", 'finished')
      identification.setCellText(49,6, "26", 'finished')

      //styles set here
      //red 
      identification.rows._[7].cells[5].style = 0;
      identification.rows._[8].cells[5].style = 0;
      identification.rows._[9].cells[5].style = 0;
      identification.rows._[14].cells[5].style = 0;
      identification.rows._[15].cells[5].style = 0;
      identification.rows._[17].cells[5].style = 0;
      identification.rows._[18].cells[5].style = 0;
      identification.rows._[19].cells[5].style = 0;

      identification.rows._[22].cells[5].style = 0;
      identification.rows._[24].cells[5].style = 0;
      identification.rows._[25].cells[5].style = 0;

      identification.rows._[28].cells[5].style = 0;
      identification.rows._[29].cells[5].style = 0;
      identification.rows._[30].cells[5].style = 0;
      identification.rows._[31].cells[5].style = 0;

      identification.rows._[34].cells[5].style = 0;
      identification.rows._[35].cells[5].style = 0;
      identification.rows._[36].cells[5].style = 0;
      identification.rows._[37].cells[5].style = 0;

      identification.rows._[40].cells[5].style = 0;
      identification.rows._[41].cells[5].style = 0;
      identification.rows._[42].cells[5].style = 0;
      identification.rows._[43].cells[5].style = 0;

      //column headers
      identification.rows._[13].cells[5].style = 1;
      identification.rows._[13].cells[6].style = 1;
      identification.rows._[13].cells[7].style = 1;


      identification.cols._[5] = {width: 307}
      identification.cols._[7] = {width: 307}

      identification.rows_[12].cells[5].style = 2;
      sheet.reRender();

      sheet.on('cell-selected', (cell:any, ri:any, ci:any) => {
        console.log('cell:', cell, ', ri:', ri, ', ci:', ci);
        sheet.bottombar.clickSwap2(sheet.bottombar.items[0])
      })
      sheet.reRender();
}

export default spreadsheetInitialize;