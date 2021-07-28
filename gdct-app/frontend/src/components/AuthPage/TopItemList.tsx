import React from 'react';
import DrawerItem from './DrawerItem';
import IconItem from './IconItem';

const TopItemList = ({ config, isMobile }:{config:any, isMobile:boolean}) => {
  return (
    <div style={{ display: 'flex', marginLeft: 'auto' }}>
      {!isMobile &&
        config.map((item:any, index:number) => {
          const { type, name, icon, url } = item;
          return item.type !== 'drawer' ? (
            //@ts-ignore
            <IconItem key={`${type}-${name}-${index}`} name={name} url={url} icon={icon} />
          ) : (
            <DrawerItem key={`${type}-${name}-${index}`} {...item} />
          );
        })}
    </div>
  );
};

export default TopItemList;
