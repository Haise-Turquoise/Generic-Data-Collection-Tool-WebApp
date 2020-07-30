import React from 'react';

import AcUnitIcon from '@material-ui/icons/AcUnit';
import MenuItems from '../../../commonComponents/MenuItems';

const Edit = ({ openedMenuName, handleClickMenu, handleHoverMenu }) => {
  const options = [
    {
      icon: <AcUnitIcon />,
      label: 'LABEL',
    },
  ];

  return (
    <MenuItems
      openedMenuName={openedMenuName}
      label="Edit"
      options={options}
      handleClickMenu={handleClickMenu}
      handleHoverMenu={handleHoverMenu}
    />
  );
};

export default Edit;
