import React, { useState, useEffect } from 'react';
import navigationConfig from '../../components/AuthPage/config';
import DrawerItem from '../../components/DrawerItem/DrawerItem';
import IconItem from '../../components/IconItem/IconItem';
import { Button } from '@material-ui/core';

const MenuHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const [config, setConfig] = useState([]);
  useEffect(() => {
    navigationConfig().then(res => {
      setConfig(res);
    });
  }, []);
  return (
    <>
      {config
        .filter(item => item.type !== 'divider')
        .map((item, index) => {
          const { type, name, icon, url } = item;
          return item.type !== 'drawer' && item.type !== 'topmenu' ? (
            // @ts-ignore
            <IconItem key={`${type}-${name}-${index}`} name={name} url={url} icon={icon} />
          ) : item.type === 'topmenu' ? (
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
              style={{ color: 'white', width: '100%', padding: '0' }}
            >
              <IconItem key={`${type}-${name}-${index}`} name={name} url={url} icon={icon} type={type} />
            </Button>
          ) : (
            <DrawerItem key={`${type}-${name}-${index}`} {...item} option="main" />
          );
        })}
    </>
  );
};

const GDCTMenu = () => {
  return (
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, auto))',
        gap: '1em',
      }}
    >
      <MenuHeader />
    </div>
  );
};

export default GDCTMenu;
