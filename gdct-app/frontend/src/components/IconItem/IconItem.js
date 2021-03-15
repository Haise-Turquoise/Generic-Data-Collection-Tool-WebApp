import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

const renderItem = ({ name, icon, url, handleClick, option }) => {
  return option === 'main' ? (
    <Tooltip title={name} arrow>
      <ListItem component={url && Link} button to={url} style={{ display: 'block' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ListItemIcon onClick={handleClick}>{icon}</ListItemIcon>
          <ListItemText primary={name} style={{ color: '#838383' }} />
        </div>
        <ListItemText secondary={'Simple description can be here about the menu'} />
      </ListItem>
    </Tooltip>
  ) : (
    <Tooltip title={name} arrow>
      <ListItem component={url && Link} button to={url}>
        <ListItemIcon style={{ color: 'white', minWidth: '0' }} onClick={handleClick}>
          {icon}
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};

const IconItem = ({ name, icon, url, handleClick, isSubMenu = false, option }) => {
  const renderData = isSubMenu ? (
    <>
      <ListItem key={name} component={url && Link} button to={url} style={{ color: 'black' }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </>
  ) : (
    renderItem({ name, icon, url, handleClick, option })
  );
  return renderData;
};

export default IconItem;
