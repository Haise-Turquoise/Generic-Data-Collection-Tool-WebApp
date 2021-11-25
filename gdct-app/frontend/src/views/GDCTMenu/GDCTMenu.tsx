import React, { useState, useEffect, MouseEventHandler, MouseEvent, Fragment } from 'react';
import { Button, Grid, SvgIconProps, SvgIconTypeMap } from '@material-ui/core';
//@ts-ignore
import createUserNavigation from '../../components/AuthPage/createUserNavigation';
//@ts-ignore
import DrawerItem from '../../components/AuthPage/DrawerItem';
//@ts-ignore
import IconItem from '../../components/AuthPage/IconItem';
import { MappedMenu } from '../../types/menu';
import SubmissionStatus from '../../types/submissionstatus'

import submissionStatusController from '../../controllers/SubmissionStatus';
import BarGroupComponent from './BarGroup';
import SubmissionMenu from './submissionMenu';

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
  const [statuses, setStatuses] = useState<SubmissionStatus[] | undefined>(undefined);
  //fetch submission state information

  const getSubmissions = async () => {
    submissionStatusController.fetchStatus()
      .then( (res: any) => {
        setStatuses(res);
      })
      .catch((e: Error) => {
        console.log(e);
      })
  }

  useEffect(() => {
    // send HTTP request
    // save response to variable
    if (localStorage.getItem('currentRole') === 'Business Admin') getSubmissions();
  }, [])


  const barGroupStyle = {
    position: "flex", 
    margin:"0 auto"
  }

  return (

  //conditionally render the component based if the current user is Admin or not 
  <div>
    {localStorage.getItem('currentRole') === 'Business Admin' ?
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexFlow: 'row-wrap',  }}>
      {statuses == undefined ? <div>loading...</div> :  <div style={barGroupStyle as React.CSSProperties}> <BarGroupComponent width={700} height={500} submissionData={statuses} events={true} /> </div> }
    </div>
    :
    <div>
        <SubmissionMenu />
    </div>
    }

  </div>


        
  );
};

export default GDCTMenu;
