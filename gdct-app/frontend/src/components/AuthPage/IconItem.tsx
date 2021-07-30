import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, ListItem, ListItemIcon, ListItemText, SvgIconTypeMap, SvgIconProps } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const renderItem = ({ name, icon, url, handleClick, option, type }
  :{name:string, icon:React.ReactElement<SvgIconProps>, url:string, handleClick:()=>void,option:string, type:string}) => {
  const ListitemProps = {
    component:url && Link,
    to:url,
    style: {display: 'block'},

  };
  return option === 'main' || type === 'topmenu' ? (
    //@ts-ignore
    <Tooltip title={name} arrow>
      {/*@ts-ignore*/}
      <ListItem component = {url && Link} button to = {url} style = {{display: 'block'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ListItemIcon onClick={handleClick}>{icon}</ListItemIcon>
          <ListItemText primary={name} style={{ color: '#838383' }} />
        </div>
        <ListItemText secondary={`CLICK HERE TO GO TO FEATURE: ${name}`} />
      </ListItem>
    </Tooltip>
  ) : (
    //@ts-ignore
    <Tooltip title={name} arrow>
      {/*@ts-ignore*/}
      <ListItem component={url && Link} button to={url}>
        <ListItemIcon style={{ color: 'white', minWidth: '0' }} onClick={handleClick}>
          {icon}
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};

const IconItem = ({ name, icon, url, handleClick, isSubMenu = false, option, type }:{
  name:string, icon:React.ReactElement<SvgIconProps>, url:string, handleClick:()=>void, isSubMenu:boolean, option:string, type:string,
}) => {
  //@ts-ignore
  const renderData = isSubMenu ? (
    //@ts-ignore
    <ListItem key={name} component={url && Link} button to={url} style={{ color: 'black' }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={name} />
    </ListItem>
  ) : (
    renderItem({ name, icon, url, handleClick, option, type })
  );
  return renderData;
};

export default IconItem;
