import React, { useState, useEffect, MouseEventHandler, MouseEvent, Fragment } from 'react';
import { Button, Grid, SvgIconProps, SvgIconTypeMap } from '@material-ui/core';
//@ts-ignore
import createUserNavigation from '../../components/AuthPage/createUserNavigation';
//@ts-ignore
import DrawerItem from '../../components/AuthPage/DrawerItem';
//@ts-ignore
import IconItem from '../../components/AuthPage/IconItem';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { MappedMenu , SubmissionStatus } from '../../types/menu';

import submissionStatusController from '../../controllers/SubmissionStatus';
import BarGroupComponent from './BarGroup';
import { fetchWithStatus } from '../../tools/misc';

import {FormControl, InputLabel, Select, MenuItem} from '@material-ui/core';


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
  const [statuses, setStatuses] = useState<SubmissionStatus[]>( [{
    _id: { name: '', submissionPeriod: ''},
    countSubmitted: 0,
    countUnsubmitted: 0,
  }]);
  //fetch submission state information

  const getSubmissions = async () => {
    await submissionStatusController.fetchStatus()
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
    getSubmissions();
  }, [])


  const barGroupStyle = {
    display: 'flex', 
    flexDirection: 'row'
  }

  return (
    <Fragment>
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
      <Grid 
        item
        xs={12}
        style={{ display: "flex", gap: "1rem", alignItems: "center", height: '100%'}}
        >
        <Grid item >
          <BarGroupComponent width={500} height={500} submissionData={statuses} events={true} />
        </Grid>
      </Grid>

    </Fragment>
  );
};

export default GDCTMenu;
