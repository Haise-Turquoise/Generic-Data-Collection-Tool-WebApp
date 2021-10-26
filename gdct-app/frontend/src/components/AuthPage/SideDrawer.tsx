import React, { Fragment , useState, useRef} from 'react';
import { MouseEvent, ChangeEvent, FormEvent} from 'react';
import { Link } from 'react-router-dom';
import { withStyles, Button, Menu, ListItemText, ListItem, MenuItem} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
//@ts-ignore
import IconItem from './IconItem';
import { makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import NestedMenuItem from './nestedMenu';



const MenuItemIcon = ({ icon }:{
    icon:string,
}) => <ListItemIcon>{icon}</ListItemIcon>;



export default function SideDrawer(props:any) {
  const { name, icon, url, children, isSubMenu, option, closeParent } = props;
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & Element)|null>(null);


  //setup props for nestedmenuitem 
  const [menuPosition, setMenuPosition] = useState<any>({top: 10, left: 10})
  const menuItemRef = useRef<any>(null);


  const handleItemClick = (event: React.MouseEvent) => {
    setMenuPosition(null)
  }

  

  return (
    <div>

      <NestedMenuItem
        ref={menuItemRef}
        // label={name}
        parentMenuOpen={!!menuPosition}
        onClick={handleItemClick}
        label={
          <>
            {icon && <MenuItemIcon icon={icon}/>}
            <ListItemText primary={name}>{name}</ListItemText>
          </>
        }
      >
        
        {children.map((item:any) => {
          const { name, type, url, icon } = item;
          if (type === 'drawer') {
            return (
              <SideDrawer
                key={`${type}-${name}`}
                {...item}
                isSubMenu={true}

              />
            );
          }
          return (
            <ListItem key={name} component={url && Link} button to={url}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={name} />

            </ListItem>
          );
        })}
      </NestedMenuItem>
      
    </div>
  );
}
