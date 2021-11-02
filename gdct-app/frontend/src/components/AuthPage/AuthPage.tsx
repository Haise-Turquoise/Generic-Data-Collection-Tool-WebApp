import React, { useState, Fragment, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { makeStyles, useTheme, Theme} from '@material-ui/core/styles';
import {
  AppBar,
  Drawer,
  Chip,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Switch,
  FormControlLabel,
  Menu,
  Popover,
  MenuItem,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
//@ts-ignore
import createUserNavigation from './createUserNavigation';
//@ts-ignore
import TopItemList from './TopItemList';
import './_chip.scss';
import './_listitem.scss';
//@ts-ignore
import Usernavigation from '../../types/usernavigation';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { completeBorderStyleMap } from '../../constants/styles';
import SideDrawer from './SideDrawer';


const drawerWidth = 240;
const headerHeight = 55;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    marginTop: 64,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`,
    height: `calc(100% - ${headerHeight}px) !important`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: 'auto',
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  toolbar: {
    display: 'flex',
    marginLeft: '1rem',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex: {
    display: 'flex',
  },
  flexItem: {
    marginLeft: 'auto',
    margin: '0',
  },
  title: {
    color: 'white',
    '&:hover': {
      color: 'white',
      textDecoration: 'none',
    },
  },
  chip: {
    padding: '20px 15px',
    textAlign: 'center',
  },
  chipTitle: {
    fontSize: '0.9rem',
  },
  chipSubtitle: {
    fontSize: '0.75rem',
    color: 'gray',
  },
}));
const check = ()=>console.log("jewifjwif");
const HeaderHandle = ({ open, classes, handleDrawerOpen, isTopMenu }:{
  open:boolean,
  classes:any,
  handleDrawerOpen:()=>void,
  isTopMenu:boolean,
}) => {
  return (
    !isTopMenu && (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={clsx(classes.menuButton, open)}
      >
        <MenuIcon />
      </IconButton>
    )
  );
};

const HeaderTitle = ({ title }:{
  title:string
}) => (
  <Typography variant="h6" noWrap>
    {title}
  </Typography>
);

const checkRole = () => {
  const currRole = localStorage.getItem('currentRole');
  return currRole && currRole !== 'undefined' && currRole !== 'null';
};

const Header = ({
  title,
  classes,
  config,
  open,
  setOpen,
  handleDrawerOpen,
  isTopMenu,
  setTopMenu,
  isMobile,
}:{
  title:string,
  classes:any,
  config:any,
  open:boolean,
  setOpen:(flag:boolean)=>void,
  handleDrawerOpen:()=>void,
  isTopMenu:boolean,
  setTopMenu:(flag:boolean)=>void,
  isMobile:boolean,
}) => (
  <AppBar
    position="fixed"
    className={clsx(classes.appBar, {
      [classes.appBarShift]: false,  
    })}
  >
    <Toolbar className={classes.flex}>
      
      {/*@ts-ignore*/}
      <HeaderHandle
        open={open}
        classes={classes}
        handleDrawerOpen={handleDrawerOpen}
        isTopMenu={isTopMenu}
      />
      <Link to="/" className={classes.title}>
        <HeaderTitle title={title} />
      </Link>
      {isTopMenu && <TopItemList config={config}  isMobile={isMobile} />}
      <Chip
        label={
          <span>
            <span className={classes.chipTitle}>{localStorage.getItem('currentUser')}</span>
            <br />
            {/* subtitle to show if user has a roles */}
            {checkRole() && (
              <span className={classes.chipSubtitle}>{localStorage.getItem('currentRole')}</span>
            )}
          </span>
        }
        id="MuiChip-label-Authpage"
        className={classes.chip}
      />
      <FormControlLabel
        className={classes.flexItem}
        control={
          <Switch
            checked={isTopMenu}
            onChange={() => {
              setTopMenu(!isTopMenu);
              setOpen(false);
            }}
            aria-label="login switch"
          />
        }
        label={isTopMenu ? 'Top' : 'Left'}
      />
    </Toolbar>
  </AppBar>
);

const MenuItemIcon = ({ icon }:{
  icon:string,
}) => <ListItemIcon>{icon}</ListItemIcon>;

const MenuItemLink = ({ name, icon, url, type, level }:{
  name:string,
  icon:string,
  url:any,
  type:string,
  level:string|number
}) => (
  <ListItem
    component={url && Link}
    button
    to={url}
    id={window.location.pathname.includes(url) ? 'active' : ''}
  >
    <MenuItemIcon icon={icon} />
    {level === '2' ? (
      <ListItemText
        primary={
          <Typography style={{ fontSize: '0.8rem', marginLeft: '1.5rem' }}>{name}</Typography>
        }
      />
    ) : type === 'topmenu' ? (
      <ListItemText primary={name} />
    ) : (
      <ListItemText
        primary={
          <Typography style={{ fontSize: '0.9rem', marginLeft: '1.2rem' }}>{name}</Typography>
        }
      />
    )}
  </ListItem>
);

const MenuItems = ({ menuItems, level }:{
  menuItems:any,
  level:string|number,
}) => {
  return menuItems.map((menuItem:any, index:number) => {
    if (menuItem.type === 'drawer') {
      const { type, name, icon, url } = menuItem;
      return (
          <MenuDrawer key={`${menuItem.type}-${menuItem.name}-${index}`} {...menuItem} level="2" />        
          );
    }
    return (
      <MenuItemLink
        key={`${menuItem.type}-${menuItem.name}-${index}`}
        {...menuItem}
        level={level}
      />
    );
  });
};

const MenuItemsList = ({ menuItems, level }:{
  menuItems:any,
  level:string|number,
}) => (
  <List component="div" disablePadding>
    <MenuItems menuItems={menuItems} level={level} />
  </List>
);

const MenuDrawerItems = ({ menuItems, open, level }:{
  menuItems:any,
  open:boolean,
  level:string|number,
}) => (
  <Collapse in={open} timeout="auto" unmountOnExit style={{ minHeight: '1' }}>
    <MenuItemsList menuItems={menuItems} level={level} />
  </Collapse>
);

const MenuDrawerTitle = ({ button = true, name, icon, open, handleClick, level }:{
  button:true,
  name:string,
  icon:any,
  open:boolean,
  handleClick:(target:any)=>void,
  level:string|number,
}) => (
  <ListItem button={button} onClick={handleClick}>
    {icon && <MenuItemIcon icon={icon} />}
    {level === '2' ? (
      <ListItemText
        primary={
          <Typography style={{ fontSize: '0.9rem', marginLeft: '1.2rem' }}>{name}</Typography>
        }
      />
    ) : (
      <ListItemText primary={name} />
    )}
    {open ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
  </ListItem>
);

const MenuDrawer = ({ name, icon, children, level = 1 }:{
  name:string,
  icon:any,
  children:Object,
  level:number|string,
}) => {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(target => setOpen(!open), [open]);
  //@ts-ignore
  return (
    //@ts-ignore
    <Fragment>
      <MenuDrawerTitle name={name} icon={icon} handleClick={handleToggle} level={level} open={open} button={true}/>
      <MenuDrawerItems open={open} menuItems={children} level={level} />
    </Fragment>
  );
};

const NavigationContent = ({ config }:{config:any}) => {
  console.log('config', config);
  return config.map((item:Usernavigation, index:number) => {
    let Component;

    const { type, name } = item;
    switch (type) {
      case 'drawer':
        //was menudrawer
        Component = SideDrawer;
        break;
      default:
        Component = MenuItemLink;
        break;
    }
    return <Component key={`${type}-${name}-${index}`} {...item} />;
  });
};

const closeMenu = () => {

};

const NavigationDrawer = ({open, theme, config, classes, handleDrawerClose }:{
  open:boolean,
  theme:Theme,
  config:any,
  classes:any,
  handleDrawerClose:()=>void,
}) => (
  <ClickAwayListener onClickAway={handleDrawerClose}>
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open} 
      onBlur={()=> console.log("hi i am here")}
      // onClose={handleDrawerClose}
      classes={{
        paper: classes.drawerPaper,
      }}
  >
      <NavigationContent config={config} />
    </Drawer>
  </ClickAwayListener> 
);

const AuthPage = ({
  // headerTitle = 'MOHLTC - Generic Data Collection Tool',
  headerTitle = 'MOH - OHFS Budgeting and Forecasting',

  children,
}:{
  headerTitle?:string,
  children:Object,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [config, setConfig] = useState([]);
  const [open, setOpen] = useState(false);
  const [isTopMenu, setTopMenu] = useState(true);
  const [isMobile, setMobile] = useState(window.matchMedia('(max-width: 1000px)').matches);
  useEffect(() => {
    const handler = (e:any) => setMobile(e.matches);
    window.matchMedia('(max-width: 1000px)').addListener(handler);
    setTopMenu(!isMobile);
    createUserNavigation().then((res:any) => {
      console.log('res', res)
      setConfig(res);
    });
  }, [isMobile]);
  // const state = {count : 0}

  const [count, setCount] = useState(0);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  
  const handleDrawerClose2 = () => {
    if(open === true){
      setCount(prev => prev + 1)
      console.log(count)
    }
    if((open === true) && count == 1){
      setOpen(false);
      setCount(0);
    }
    console.log("you clicked away from the drawer");
    console.log(open);
    console.log(count);
  };
  const style = { paddingTop: '5.7rem', marginLeft: `-${drawerWidth}px` };
          
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        title={headerTitle}
        classes={classes}
        open={open}
        setOpen={setOpen}
        handleDrawerOpen={handleDrawerOpen}
        config={config}
        isTopMenu={isTopMenu}
        setTopMenu={setTopMenu}
        isMobile = {isMobile}
      />
      <NavigationDrawer
        theme={theme}
        classes={classes}
        open={open}
        config={config}
        handleDrawerClose={handleDrawerClose2}
      />
      <main
        style={style}
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {children}
      </main>
    </div>
  );
};


export default AuthPage;
