import React, { useState, Fragment } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Button from '@material-ui/core/Button';

import Popper from '@material-ui/core/Popper';

import './MenuItems.scss';

const MenuOptionItemIcon = ({ icon }) => <ListItemIcon>{icon}</ListItemIcon>;

const MenuOptionItemLabel = ({ label }) => <ListItemText>{label}</ListItemText>;

// ! Recurse here when menu item has children
const MenuOption = ({ icon, label, handleClick }) => (
  <ListItem onClick={handleClick} button>
    {icon && <MenuOptionItemIcon icon={icon} />}
    <MenuOptionItemLabel label={label} />

    {/* RECURSE */}
  </ListItem>
);

// ! Could be a divider! There could be children too!
const MenuOptionsItems = ({ options }) =>
  options.map(({ isDivider, icon, label, children, handleClick }, index) => (
    <Fragment key={index}>
      {isDivider ? <Divider /> : <MenuOption icon={icon} label={label} handleClick={handleClick} />}
    </Fragment>
  ));

const MenuOptionsContainer = ({ options }) => (
  <List>
    <MenuOptionsItems options={options} />
  </List>
);

export const MenuOptions = ({ isOpen, options, anchorEl }) => (
  <Popper
    className="menuOptionsContainer"
    open={isOpen}
    // placement="bottom-start"
    anchorEl={anchorEl}
  >
    <MenuOptionsContainer options={options} />
  </Popper>
);

const MenuLabel = ({ isOpen, label, handleClickMenuLabel, handleHoverMenuLabel }) => (
  <Button
    className={isOpen ? 'menuOption__label--active' : ''}
    onClick={handleClickMenuLabel}
    onMouseEnter={handleHoverMenuLabel}
    disableFocusRipple={true}
    disableRipple={true}
  >
    {label}
  </Button>
);

const Menu = ({ openedMenuName, label, options, handleClickMenu, handleHoverMenu }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickMenuLabel = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    handleClickMenu(label);
  };

  const handleHoverMenuLabel = ({ currentTarget }) => {
    setAnchorEl(currentTarget);
    handleHoverMenu(label);
  };

  const isOpen = label === openedMenuName;

  return (
    <div>
      <MenuLabel
        isOpen={isOpen}
        label={label}
        handleClickMenuLabel={handleClickMenuLabel}
        handleHoverMenuLabel={handleHoverMenuLabel}
      />
      <MenuOptions isOpen={isOpen} options={options} anchorEl={anchorEl} />
    </div>
  );
};

export default Menu;
