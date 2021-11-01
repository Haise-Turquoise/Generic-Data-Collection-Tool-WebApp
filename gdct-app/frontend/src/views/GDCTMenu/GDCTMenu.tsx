import React, { useState, useEffect, MouseEventHandler, MouseEvent } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Button, SvgIconProps, SvgIconTypeMap } from '@material-ui/core';
//@ts-ignore
import createUserNavigation from '../../components/AuthPage/createUserNavigation';
//@ts-ignore
import DrawerItem from '../../components/AuthPage/DrawerItem';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import IconItem from '../../components/AuthPage/IconItem';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { selectSubmissionsStore } from '../../store/SubmissionsStore/selectors';
import { getSubmissionsRequest } from '../../store/thunks/submission';
import { Submission } from '../../types/submissions'
import { MappedMenu } from '../../types/menu';
import './menuStyle.css';

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
        console.log(url);
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
  const dispatch = useDispatch();
  const [readMessage, setMessage] = useState('Loading submissions...');

  let { submissions }:{submissions:Submission[]} = useSelector(
    state => ({
      submissions: selectFactoryRESTResponseTableValues(selectSubmissionsStore)(state),
    }),
    shallowEqual,
  )

  if (submissions.length == 0) {
    
    console.log("hit");
    dispatch(getSubmissionsRequest(()=>{setMessage('Nothing to show');}));
  }


  useEffect(()=>{
    console.log("hi");
    console.log(submissions);
  },[submissions])

  return (

    <div>
      <p>Welcome back to GDCT</p>

      <div className="subDasboard">
        <div className="subDasboardTitle">
          <div className="subleft">Submission Dashboard To-do..</div>
          <div className="subright"> <a> See more in submission dashboard</a></div>
        </div>
        
      </div>
       
    </div>
  );
};

export default GDCTMenu;
