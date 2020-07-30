import { extractReactAndWorkbookState } from '@tools/excel';

import { CustomEditor } from '@tools/slate';

import { editorToRichTextMap, richTextToEditorMap } from '@constants/styles';

import { REST_ADMIN_TEMPLATES, REST_ADMIN_BUNDLES_WORKFLOW } from '@constants/rest';

class EventListener extends PureComponent {
  saveTemplate(commonProps) {
    const { isTemplatePublished, templateId } = this.props;

    commonProps.isTemplatePublished = isTemplatePublished;

    const fileStates = extractReactAndWorkbookState(commonProps, this.inactiveSheets);

    const newTemplate = {
      published: isTemplatePublished,
      fileStates,
      name: fileStates.name,
    };

    // ! Add more checks
    adminTemplateRoleAxios
      .put(`${REST_ADMIN_TEMPLATES}/${templateId}`, { newTemplate })
      .catch(error => console.error(error));
  }

  saveBundle(bundleAxiosRouter, commonProps) {
    const { bundleId, templateId } = this.props;

    const fileStates = extractReactAndWorkbookState(commonProps, this.inactiveSheets);

    bundleAxiosRouter
      .put(`${REST_ADMIN_BUNDLES_WORKFLOW}/${bundleId}/workbook/${templateId}`, {
        workbook: fileStates,
      })
      .catch(error => {
        console.error(error);
      });
  }

  saveEditBundle(commonProps) {
    this.saveBundle(adminEditBundleRoleAxios, commonProps);
  }

  saveReviewBundle(commonProps) {
    this.saveBundle(adminReviewBundleRoleAxios, commonProps);
  }

  saveApproveBundle(commonProps) {
    this.saveBundle(adminApproveBundleRoleAxios, commonProps);
  }

  saveManagerBundle(commonProps) {
    this.saveBundle(adminBundleRoleAxios, commonProps);
  }

  save() {
    const {
      type,
      name,
      activeSheetName,
      sheetNames,
      activeCellPosition,
      sheetCellData,
      sheetColumnCount,
      sheetColumnWidths,
      sheetFreezeColumnCount,
      sheetRowCount,
      sheetRowHeights,
      sheetFreezeRowCount,
      sheetHiddenColumns,
      sheetHiddenRows,
      stagnantSelectionAreas,
    } = this.props;

    const commonProps = {
      name,
      activeSheetName,
      sheetNames,
      activeCellPosition,
      sheetCellData,
      sheetColumnCount,
      sheetColumnWidths,
      sheetFreezeColumnCount,
      sheetRowCount,
      sheetRowHeights,
      sheetFreezeRowCount,
      sheetHiddenColumns,
      sheetHiddenRows,
      stagnantSelectionAreas,
    };

    if (type === 'template') {
      this.saveTemplate(commonProps);
    } else if (type === 'bundle_edit') {
      this.saveEditBundle(commonProps);
    } else if (type === 'bundle_review') {
      this.saveReviewBundle(commonProps);
    } else if (type === 'bundle_approve') {
      this.saveApproveBundle(commonProps);
    }
  }

  // ! TODO : selection instead of just active cell

  // ! Make the active style be the focus of styles
  applyBlockStyle(property, propertyValue) {
    const { sheetCellData, handleUpdateSheetCellData } = this.props;
    // Get the rows/columns
    // ! Consider border enclosure -- is it by cell or by range?
    const containedArea = this._getAllAreas();

    for (const row in containedArea) {
      const rowArea = containedArea[row];

      if (!sheetCellData[row]) sheetCellData[row] = {};

      for (const column in rowArea) {
        if (!sheetCellData[row][column]) sheetCellData[row][column] = {};

        const { property: blockProperty, style: blockPropertyStyle } = editorToRichTextMap[
          property
        ];

        if (blockProperty) {
          if (blockPropertyStyle) {
            if (!sheetCellData[row][column].styles) sheetCellData[row][column].styles = {};

            const cellStyles = sheetCellData[row][column].styles;

            if (cellStyles[blockProperty]) {
              const potentialStyles = Object.values(richTextToEditorMap[blockProperty]).length;

              if (potentialStyles > 1) {
                const presentStyles = cellStyles[blockProperty].split(' ');

                const potentialIndex = presentStyles.findIndex(
                  style => style === blockPropertyStyle,
                );

                if (potentialIndex > -1) {
                  cellStyles[blockProperty] = presentStyles
                    .splice(blockPropertyStyle, potentialIndex)
                    .join(' ');
                } else {
                  cellStyles[blockProperty] = `${cellStyles[blockProperty]} ${blockPropertyStyle}`;
                }
              } else {
                // Replace style
                delete cellStyles[blockProperty];
              }
            } else {
              cellStyles[blockProperty] = blockPropertyStyle;
            }
          } else {
            // ! Custom style - Make use of property value
          }
        } else {
          console.error('Style not supported');
        }
      }
    }

    handleUpdateSheetCellData(sheetCellData);

    this.saveActiveCellInputData();
    this.disableEditMode();
  }

  applyTextStyle(property, propertyValue) {
    const {
      isEditMode,
      activeCellInputData: { formulaEditor, cellEditor },
    } = this.props;

    if (isEditMode) {
      ReactEditor.focus(cellEditor);
      Transforms.select(cellEditor, Editor.end(cellEditor, []));

      if (!propertyValue) {
        CustomEditor.toggleMark(formulaEditor, property);
        CustomEditor.toggleMark(cellEditor, property);
      }
    } else {
      // Apply block style
      this.applyBlockStyle(property, propertyValue);
    }
  }
}

EventListener = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(EventListener);

export default EventListener;
