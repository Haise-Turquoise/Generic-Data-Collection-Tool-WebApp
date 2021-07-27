import React from 'react';
import { MouseEvent, ChangeEvent, FormEvent} from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Button, Menu, ListItemText, ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
//@ts-ignore
import IconItem from './IconItem';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})(props => (
  // @ts-ignore
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default function DrawerItem(props:any) {
  const { name, icon, url, children, isSubMenu, option, closeParent } = props;
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & Element)|null>(null);

  const handleClick = (event:MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (isSubMenu && closeParent) {
      // close all parent menus also
      closeParent();
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: 'white', width: '100%', padding: '0' }}
      >
        {/*@ts-ignore*/}
        <IconItem name={name} url={url} icon={icon} isSubMenu={isSubMenu} option={option} />
      </Button>
      <StyledMenu
        //@ts-ignore
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        
        {children.map((item:any) => {
          const { name, type, url, icon } = item;
          if (type === 'drawer') {
            return (
              <DrawerItem
                key={`${type}-${name}`}
                {...item}
                isSubMenu={true}
                closeParent={handleClose}
              />
            );
          }
          return (
            <ListItem key={name} component={url && Link} button to={url} onClick={handleClose}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          );
        })}
      </StyledMenu>
    </div>
  );
}
