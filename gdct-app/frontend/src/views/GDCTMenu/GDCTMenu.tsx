import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { Button, SvgIconProps, SvgIconTypeMap } from '@material-ui/core';
//@ts-ignore
import createUserNavigation from '../../components/AuthPage/createUserNavigation';
//@ts-ignore
import DrawerItem from '../../components/AuthPage/DrawerItem';
//@ts-ignore
import IconItem from '../../components/AuthPage/IconItem';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { MappedMenu } from '../../types/menu';
import './menuStyle.css';
import AuditMenu from './auditMenu';

const MenuHeader = () => {
  const [anchorEl, setAnchorEl] = React.useState<EventTarget | null>(null);
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const [config, setConfig] = useState<MappedMenu[]>([]);
  useEffect(() => {
    createUserNavigation().then((res: MappedMenu[]) => {
      setConfig(res);
    });
  }, []);
  return (
    <>
      {config.map((item, index) => {
        const { type, name, icon, url } = item;
        return item.type !== 'drawer' && item.type !== 'topmenu' ? (
          // @ts-ignore
          <IconItem key={`${type}-${name}-${index}`} name={name} url={url} icon={icon} />
        ) : item.type === 'topmenu' ? (
          <Button
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick as MouseEventHandler<HTMLButtonElement>}
            style={{ color: 'white', width: '100%', padding: '0' }}
          >
            <IconItem
              key={`${type}-${name}-${index}`}
              name={name}
              url={url}
              icon={icon}
              type={type}
              handleClick={()=>{}}
              isSubMenu={false}
              option=''
            />
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
    <div>
      <AuditMenu/>
    </div>
      
  );
};

export default GDCTMenu;
