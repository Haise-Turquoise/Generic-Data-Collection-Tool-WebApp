import React, { useCallback } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import InputBase from '@material-ui/core/InputBase';
import { setName } from '../../../../store/actions/ui/excel/commands';

// TODO : Make input width contain text - react virtualized
// TODO : Events handler: blur, key down (escape), ...
const Title = () => {
  const dispatch = useDispatch();

  const name = useSelector(
    ({
      ui: {
        excel: {
          present: { name },
        },
      },
    }) => name,
    shallowEqual,
  );

  const handleChange = useCallback(({ target: { value } }) => dispatch(setName(value)), [dispatch]);

  const handleKeyDown = ({ key, target }) => {
    if (key === 'Enter') target.blur();
  };

  return (
    <InputBase
      className="appBarMain__title"
      type="text"
      value={name}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      fullWidth
    />
  );
};

export default Title;
