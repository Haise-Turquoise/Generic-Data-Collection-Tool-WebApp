import React from 'react';

import ExtensionIcon from '@material-ui/icons/Extension';
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SendIcon from '@material-ui/icons/Send';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import GridOnIcon from '@material-ui/icons/GridOn';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import SpaIcon from '@material-ui/icons/Spa';
import AppsIcon from '@material-ui/icons/Apps';
import AccountBalance from '@material-ui/icons/AccountBalance';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
  ROUTE_WORKFLOW_WORKFLOWS,
  ROUTE_COLUMN_NAMES,
  ROUTE_TEMPLATE_PCKGS_PCKGS,
} from '../../constants/routes';

const createUserNavigation = () => {
  return [
    {
      name: 'User',
      button: false,
      type: 'title',
      icon: <PeopleAltIcon />,
    },
    {
      type: 'divider',
    },
    {
      name: 'Organization',
      type: 'drawer',
      icon: <AccountBalance />,
      children: [
        {
          name: 'Organizations',
          type: 'menu',
          url: '/organizations',
          icon: <AccountBalance />,
        },
        {
          name: 'Create Organization',
          type: 'menu',
          url: '/organizations/create',
          icon: <AddCircleOutlineIcon />,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      name: 'Template',
      type: 'drawer',
      icon: <PhotoFilterIcon />,
      children: [
        {
          name: 'Templates',
          type: 'menu',
          url: '/template_manager/templates',
          icon: <PhotoFilterIcon />,
        },
        {
          name: 'Template Types',
          type: 'menu',
          url: '/template_manager/templateTypes',
          icon: <ExtensionIcon />,
        },
        {
          name: 'Template Packages',
          type: 'menu',
          url: ROUTE_TEMPLATE_PCKGS_PCKGS,
          icon: <DashboardIcon />,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      name: 'COA',
      icon: <DataUsageIcon />,
      type: 'drawer',
      children: [
        {
          name: 'COAs',
          type: 'menu',
          url: '/COA_manager/COAs',
          icon: <DataUsageIcon />,
        },
        {
          name: 'COA Groups',
          type: 'menu',
          url: '/COA_manager/COA_groups',
          icon: <GroupWorkIcon />,
        },
        {
          name: 'COA Trees',
          type: 'menu',
          url: '/COA_manager/COA_trees',
          icon: <AccountTreeIcon />,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      name: 'Submission',
      icon: <SendIcon />,
      type: 'drawer',
      children: [
        {
          name: 'Submissions',
          type: 'menu',
          url: '/submission_manager/submissions',
          icon: <SendIcon />,
        },
        {
          name: 'Submission Periods',
          type: 'menu',
          url: '/submission_manager/submissionPeriods',
          icon: <HourglassEmptyIcon />,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      name: 'Resource & Role',
      icon: <AppsIcon />,
      type: 'drawer',
      children: [
        {
          name: 'AppSyses',
          type: 'menu',
          url: '/role_manager/AppSyses',
          icon: <GroupWorkIcon />,
        },
        {
          name: 'AppSysRoles',
          type: 'menu',
          url: '/role_manager/AppSysRoles',
          icon: <GroupWorkIcon />,
        },
        {
          name: 'AppRoles',
          type: 'menu',
          url: '/role_manager/AppRoles',
          icon: <GroupWorkIcon />,
        },
        {
          name: 'AppResources',
          type: 'menu',
          url: '/role_manager/AppResources',
          icon: <GroupWorkIcon />,
        },
        {
          name: 'AppRoleResources',
          type: 'menu',
          url: '/role_manager/AppRoleResources',
          icon: <GroupWorkIcon />,
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      name: 'Sheet Names',
      type: 'menu',
      url: '/sheetNames',
      icon: <GridOnIcon />,
    },
    {
      name: 'Statuses',
      type: 'menu',
      url: '/statuses',
      icon: <AllInclusiveIcon />,
    },
    {
      name: 'Programs',
      type: 'menu',
      url: '/programs',
      icon: <SpaIcon />,
    },
    {
      name: 'Reporting Periods',
      type: 'menu',
      url: '/reportingPeriods',
      icon: <HourglassEmptyIcon />,
    },
    {
      name: 'Workflows',
      type: 'menu',
      url: ROUTE_WORKFLOW_WORKFLOWS,
      icon: <AllInclusiveIcon />,
    },
    {
      name: 'Column Names',
      type: 'menu',
      url: ROUTE_COLUMN_NAMES,
      icon: <GridOnIcon />,
    },
    {
      name: 'Logout',
      type: 'menu',
      url: '/logout',
      icon: <ExitToAppIcon />,
    },
  ];
};

const config = [...createUserNavigation()];

export default config;
