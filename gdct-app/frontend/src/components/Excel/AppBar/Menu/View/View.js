import React from 'react';

import AcUnitIcon from '@material-ui/icons/AcUnit';
import Menu from '../Menu';

const View = ({ openedMenuName, handleClickMenu, handleHoverMenu }) => {
  const options = [
    {
      icon: <AcUnitIcon />,
      label: 'LABEL',
    },
  ];

  return (
    <Menu
      openedMenuName={openedMenuName}
      label="View"
      options={options}
      handleClickMenu={handleClickMenu}
      handleHoverMenu={handleHoverMenu}
    />
  );
};

export default View;
