import React from 'react';
import ExtensionIcon from '@material-ui/icons/Extension';
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import SendIcon from '@material-ui/icons/Send';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import AppsIcon from '@material-ui/icons/Apps';
import AccountBalance from '@material-ui/icons/AccountBalance';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import CategoryIcon from '@material-ui/icons/Category';
import ListIcon from '@material-ui/icons/List';
import GroupIcon from '@material-ui/icons/Group';
import BuildIcon from '@material-ui/icons/Build';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LoopIcon from '@material-ui/icons/Loop';
import ForumIcon from '@material-ui/icons/Forum';
import StorageIcon from '@material-ui/icons/Storage';
import EventIcon from '@material-ui/icons/Event';
import ReportIcon from '@material-ui/icons/Report';
import SearchIcon from '@material-ui/icons/Search';

export default {
  Submission: <SendIcon />,
  Dashboard: <SendIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Download: <CloudDownloadIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Upload: <CloudUploadIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  User: <AccountCircleIcon />,
  Profile: <AccountCircleIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Logout: <ExitToAppIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Report: <ReportIcon />,
  Reports: <ReportIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Admin: <SupervisorAccountIcon />,
  Template: <PhotoFilterIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'Template Design': <FileCopyIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Template Type': <ExtensionIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Template package': <SearchIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  Organization: <AccountBalance style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Organizations: <AccountBalance style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Create organization': (
    <AddCircleOutlineIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />
  ),
  'Submission-Lookup': <HourglassEmptyIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'Submission Type': <AccountCircleIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Submission Period': <HourglassEmptyIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  Role: <AppsIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Appsys: <GroupWorkIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  AppRole: <GroupWorkIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  AppSysRole: <GroupWorkIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  AppResource: <GroupWorkIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  AppRoleResource: <GroupWorkIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  COA: <DataUsageIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'Category management': <CategoryIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Tree management': <CategoryIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Attribute management': <ListIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Group management': <GroupIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  Workflow: <LoopIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Workflows: <LoopIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  'Add workflow': <AddCircleOutlineIcon style={{ fontSize: '1rem', marginLeft: '2.2rem' }} />,
  Configuration: <BuildIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'Business rule configure': <ForumIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'User management': <AccountCircleIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'User Role Management': (
    <AccountCircleIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />
  ),
  Program: <AccountCircleIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  Status: <StorageIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
  'Reporting period': <EventIcon style={{ fontSize: '1.2rem', marginLeft: '1.2rem' }} />,
};
