import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import './Loading.scss';

const LoadingContent = ({ message }) => (
  <Paper className="loadingContent">
    <CircularProgress />
    <Typography variant="subtitle2" color="textSecondary">
      {message || 'Loading Components...'}
    </Typography>
  </Paper>
);

const Loading = ({ message }) => (
  <Fade in>
    <div className="loadingContainer">
      <LoadingContent message={message} />
    </div>
  </Fade>
);

export default Loading;
