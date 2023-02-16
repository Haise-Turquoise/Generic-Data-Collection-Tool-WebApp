import React from 'react';
import { NavLink } from 'react-router-dom';

const home = () => {
  return (
    <div>
      <h1>401: Could not Authenticate</h1>
      <NavLink to="/auth">Try Again</NavLink>
    </div>
  );
};

export default home;
