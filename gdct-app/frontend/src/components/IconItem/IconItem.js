import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';

const renderItem = ({ name, icon, url, handleClick, option, type }) => {
  return option === 'main' || type === 'topmenu' ? (
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

const IconItem = ({ name, icon, url, handleClick, isSubMenu = false, option, type }) => {
  const renderData = isSubMenu ? (
    //<>
    <Button
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={handleClick}
      style={{ color: 'white', width: '100%', padding: '0' }}
    >
      <ListItem key={name} component={url && Link} button to={url} style={{ color: 'black' }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
    </Button>
    //</>
  ) : (
    <Button
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={handleClick}
      style={{ color: 'white', width: '100%', padding: '0' }}
    >
      {renderItem({ name, icon, url, handleClick, option, type })}
    </Button>
  );
  return renderData;
};

export default IconItem;
