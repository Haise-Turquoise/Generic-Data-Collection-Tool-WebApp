# Functions

## STYLES

**convertXlsxColorToCss** : Converts excel color object to regular css

**lightenBy**: Lightens a Color by a ratio

**darkenBy**: Darkens a color by a ratio

**applyTintToColour**: Lightens or darkens a color based on a tint

**convertXlsxStyleToInlineStyle**: Converts excel style to inline style

**convertInlineStyleToXlsxStyle**: Converts inline style to excel style

## CELL

**extractCellStyle**: Converts excel styles to inline styles

**extractCellRichTextStyle**: Converts excel rich text styles to inline styles

**getCellInlineStyle**: Gets the inline styles of a cell

**getBlockStyle**: Gets the block styles of a cell

**extractRichTextData**: Parses excel rich text styles

**getActiveCellInputData**: Gets the active cell input data from sheet data

**extractCellData**: Parses excel cell data

**getSheetCellData**: Parses excel sheet data

**getCellData**: Gets the data of a cell

**getCellDataText**: Gets the text of a cell

## ROW

**getNormalRowHeight**: Gets the row height without excel's scale factor

**getExcelRowHeight**: Gets the row height with excel's scale factor

**getSheetRowsData**: Gets the data of a row (row heights, hidden rows, ...)

**getTopOffsets**: Gets the row offsets of the sheet

## COLUMN

**getNormalColumnWidth**: Gets the column width without excel's scale factor

**getExcelColumnWidth**: Gets the column width with excel's scale factor

**getSheetColumnsData**: Gets the data of a column (column width, hidden columns, ...)

**convertColumnToNumber**: Converts excel's column letters to a number

**convertNumberToColumn**: Converts a number to excel column letters

**getLeftOffsets**: Gets the column offsets of the sheet

## SHEET

**getMaxSheetRange**: Gets excel's max range of a sheet (default range or occupied sheet range, whichever is larger)

**getSheetFreezeHeader**: Gets excel's freeze counts

**createBlankSheet**: Creates a blank sheet

**getSheetHeaderCount**: Gets excel's header count for a sheet

**generateNewSheetName**: Generate a new sheet name unique to the current sheet names

**getEstimatedTotalHeight**: Gets the height of the excel window

**getEstimatedTotalWidth**: Gets the width of the excel window

## STATE

**createBlankReactState**: Generates blank workbook data

**convertExcelFileToState**: Converts an excel file to excel server state (not react state since all sheets are compressed,  instead of all but active)

**convertStateToReactState**: Converts excel server state to excel react state

**convertRichTextToEditorState**: Converts rich text to editor state (draft-js)

**convertTextToEditorState**: Converts text to editor state

**getWorkbookData**: Gets server state workbook data

**extractReactAndWorkbookState**: Gets the server state from react state and session storage

**clearEditorStateText**: Clears the editor state to only include the first fragment' styles (TODO?)

## FORMULA

**getRowRange**: Gets the row range from start to end

**getColumnRange**: Gets the column range from start to end

**getGroupFormula**: Gets all the locations contained in a group (Group is of the format COLUMN-W_ROW-X:COLUMN-Y_ROW-Z)

**getIndividualFormula**: Gets all the individual locations (Individual locations would be COLUMN-W_ROW-X, COLUMN-Y_ROW-Z)

**calculateFormula**: Calculates the formula based on the group and individual locations

**getCellLocationFromString**: Parses an excel location (ie: A5 => column A, row 5)

## MISC

**getWorkbookInstance**: Converts server/react state to an Xlsx-populate instance

**getScrollbarSize**: Gets the scroll bar size of the browser

**isPositionEqualArea**: Checks if the size of the area is equal the size of the related cell
