import React from 'react';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { ROUTE_PUBLIC_REGISTER, ROUTE_PUBLIC_LOGIN } from '../../../constants/routes';

import './Preregister.scss';
import logo from '../../../images/brand/ON_POS_LOGO_WHITE.svg';
import SRIBar from '../../../images/brand/SRI.jpg';

const Header = () => (
  <div className="header__container">
    <div className="header__bgnd">
      <img src={SRIBar} className="header__logoBar" />
      <img src={logo} height={48} alt="MOH Logo" className="header__logo" />
    </div>
  </div>
);

const Preregister = () => {
  return (
    <>
      {/* <Header/> */}
      <div className="preregister">
        <Paper className="preregister__container">
          <Box border={1} color="primary" className="preregister__box" justifyContent="center">
            <Typography className="preregister__title" variant="h6" gutterBottom>
              SRI
            </Typography>

            <Typography className="preregister__title" variant="body2" gutterBottom>
              Please agree the condition.
            </Typography>
          </Box>
          <Box
            border={1}
            color="primary"
            className="preregister__buttonBox"
            justifyContent="center"
          >
            <Button
              variant="outlined"
              color="primary"
              className="preregister__button"
              href={ROUTE_PUBLIC_REGISTER}
            >
              I ACCEPT
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className="preregister__button"
              href={ROUTE_PUBLIC_LOGIN}
            >
              CANCEL
            </Button>
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default Preregister;
