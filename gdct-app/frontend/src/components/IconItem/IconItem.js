import React from 'react';
import { Tooltip, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

const IconItem = ({ name, icon, url, handleClick, isSubMenu = false }) => {
  const renderData = isSubMenu ? (
    <>
      <ListItem key={name} component={url && Link} button to={url} style={{ color: 'black' }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </>
  ) : (
    <Tooltip title={name} arrow>
      <ListItem component={url && Link} button to={url}>
        <ListItemIcon style={{ color: 'white', minWidth: '0' }} onClick={handleClick}>
          {icon}
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
  return renderData;
};

export default IconItem;
