import React, { useCallback, useMemo } from 'react';

import { useDispatch } from 'react-redux';
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu';
import uniqid from 'uniqid';

import {
  insertRow,
  insertColumn,
  setActiveCellDialog,
  deleteCellsShiftUp,
  deleteCellsShiftLeft,
  setReadOnly,
  unsetReadOnly,
} from '../../../../store/actions/ui/excel/commands';

import './ContextMenu.scss';

const MenuIcon = ({ icon, mdiIcon }) => (
  <div className={`menuItem__icon ${mdiIcon || ''}`}>{!mdiIcon && icon}</div>
);

const MenuTextContent = ({ text, command }) => (
  <div className="menuItem__textContent">
    <div>{text}</div>
    <div>{command}</div>
  </div>
);

const SheetContextMenuItem = ({ icon, mdiIcon, text, command, handleClick }) => (
  <MenuItem className="menuItem" onClick={handleClick}>
    <MenuIcon icon={icon} mdiIcon={mdiIcon} />
    <MenuTextContent text={text} command={command} />
  </MenuItem>
);

const SubMenuContent = ({ item }) => (
  <SubMenu className="subMenu" title={item.text}>
    <GeneratedContextMenu config={item.children} />
  </SubMenu>
);

const SubMenuContainer = ({ item }) => (
  <div className="subMenuContainer">
    <SubMenuContent item={item} />
  </div>
);

const GeneratedContextMenu = ({ config }) =>
  config.map(item => {
    if (!item) return <hr key={uniqid()} className="menuDivider" />;

    return item.children ? (
      <SubMenuContainer key={uniqid()} item={item} />
    ) : (
      <SheetContextMenuItem key={uniqid()} {...item} />
    );
  });

const ContextMenuContent = ({ config }) => (
  <ContextMenu id="sheetWindowContainer" className="contextMenu">
    <GeneratedContextMenu config={config} />
  </ContextMenu>
);

const SheetContextMenu = () => {
  const dispatch = useDispatch();

  const config = useMemo(
    () => [
      // {
      //   mdiIcon: "mdi mdi-content-cut",
      //   text: "Cut",
      //   command: "Ctrl+X"
      // },
      // {
      //   mdiIcon: "mdi mdi-arrange-bring-forward",
      //   text: "Copy",
      //   command: "Ctrl+C"
      // },
      // {
      //   mdiIcon: "mdi mdi-clipboard",
      //   text: "Paste",
      //   command: "Ctrl+V"
      // },
      // null,
      {
        text: 'Insert row',
        handleClick: () => dispatch(insertRow()),
      },
      {
        text: 'Insert column',
        handleClick: () => dispatch(insertColumn()),
      },
      {
        text: 'Delete cells',
        children: [
          {
            text: 'Shift up',
            handleClick: () => dispatch(deleteCellsShiftUp()),
          },
          {
            text: 'Shift left',
            handleClick: () => dispatch(deleteCellsShiftLeft()),
          },
        ],
      },
      null,
      {
        mdiIcon: 'mdi mdi-comment',
        text: 'Comment',
        command: 'Ctrl+Alt+M',
        handleClick: () => dispatch(setActiveCellDialog({ dialog: 'comment' })),
      },
      null,
      {
        text: 'Set read-only',
        handleClick: () => dispatch(setReadOnly()),
      },
      {
        text: 'Unset read-only',
        handleClick: () => dispatch(unsetReadOnly()),
      },
      null,
      {
        text: 'Set column name',
        handleClick: () =>
          dispatch(setActiveCellDialog({ dialog: 'concept', category: 'attribute' })),
      },
      {
        text: 'Set COA',
        handleClick: () => dispatch(setActiveCellDialog({ dialog: 'group', category: 'category' })),
      },
      null,
      {
        text: 'Set prepopulate',
        handleClick: () => dispatch(setActiveCellDialog({ dialog: 'prepopulate' })),
      },
    ],
    [dispatch],
  );

  return <ContextMenuContent config={config} />;
};

export default SheetContextMenu;
