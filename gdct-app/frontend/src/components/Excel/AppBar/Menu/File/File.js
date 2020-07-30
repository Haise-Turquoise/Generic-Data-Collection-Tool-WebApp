import React, { useMemo } from 'react';

import { useDispatch } from 'react-redux';

import SaveIcon from '@material-ui/icons/Save';

import GetAppIcon from '@material-ui/icons/GetApp';
import MenuItems from '../../../commonComponents/MenuItems';

import { save, download } from '../../../../../store/actions/ui/excel/commands';

const File = ({
  openedMenuName,

  handleClickMenu,
  handleHoverMenu,
  handleSave,
}) => {
  const dispatch = useDispatch();

  const options = useMemo(
    () => [
      {
        icon: <SaveIcon />,
        label: 'Save',
        handleClick: handleSave,
      },
      {
        icon: <GetAppIcon />,
        label: 'Download',
        handleClick: () => dispatch(download()),
      },
    ],
    [dispatch],
  );

  return (
    <MenuItems
      openedMenuName={openedMenuName}
      label="File"
      options={options}
      handleClickMenu={handleClickMenu}
      handleHoverMenu={handleHoverMenu}
    />
  );
};

export default File;
