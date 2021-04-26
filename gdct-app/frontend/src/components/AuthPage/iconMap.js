import React from 'react';
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
import ListIcon from '@material-ui/icons/List';
import GroupIcon from '@material-ui/icons/Group';
import BuildIcon from '@material-ui/icons/Build';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LoopIcon from '@material-ui/icons/Loop';
import ForumIcon from '@material-ui/icons/Forum';
import StorageIcon from '@material-ui/icons/Storage';
import EventIcon from '@material-ui/icons/Event';
import ReportIcon from '@material-ui/icons/Report';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';
import SubjectIcon from '@material-ui/icons/Subject';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ListAltIcon from '@material-ui/icons/ListAlt';
import TableChartIcon from '@material-ui/icons/TableChart';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CachedIcon from '@material-ui/icons/Cached';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import InboxIcon from '@material-ui/icons/Inbox';
import DnsIcon from '@material-ui/icons/Dns';
import ScatterPlotIcon from '@material-ui/icons/ScatterPlot';

// Universal Style
const MenuItemStyle = { fontSize: '1.2rem', marginLeft: '1.2rem' };
const SubMenuItemStyle = { fontSize: '1.2rem', marginLeft: '2rem' };

// The only source for icons: https://material-ui.com/components/material-icons/
// To modify any of the icons, please directly reference its literal name string in the menu (if their strings does not match exactly, icons will not appear).
// To add icons, please add their url reference directly into the menuitem collection in the database.
export default {
  // Main Menu Submission
  Submission: <SendIcon />,
  Dashboard: <SendIcon style={MenuItemStyle} />,
  // Main Menu User
  User: <AccountCircleIcon />,
  Profile: <AccountCircleIcon style={MenuItemStyle} />,
  'Modify Permission': <AccountCircleIcon style={SubMenuItemStyle} />,
  'Modify User Info': <AccountCircleIcon style={SubMenuItemStyle} />,

  Logout: <ExitToAppIcon style={MenuItemStyle} />,
  // Main Menu Report
  Report: <ReportIcon />,
  Reports: <ReportIcon style={MenuItemStyle} />,
  // Main Menu Template Design
  'Template Design': <FileCopyIcon style={{ fontSize: '1.4rem', marginTop: '0.1rem' }}/>,
  'Template Designs': <FileCopyIcon style={{ fontSize: '1.2rem', marginTop: '0.1rem', marginLeft: '1.2rem' }}/>,
  // Main Admin
  Admin: <SupervisorAccountIcon />,

  // Admin COA
  COA: <DataUsageIcon style={MenuItemStyle} />,
  'Category Management': <ListIcon style={SubMenuItemStyle} />,
  'Attribute Management': <ViewColumnIcon style={SubMenuItemStyle} />,
  'Group Management': <GroupIcon style={SubMenuItemStyle} />,
  'Tree Management': <AccountTreeIcon style={SubMenuItemStyle} />,

  // Admin Template
  Template: <TableChartIcon style={MenuItemStyle} />,
  'Template Type': <InboxIcon style={SubMenuItemStyle} />,
  'Template Package': <AllInboxIcon style={SubMenuItemStyle} />,

  // Admin Organization
  Organization: <AccountBalance style={MenuItemStyle} />,
  Organizations: <AccountBalance style={SubMenuItemStyle} />,
  'Create Organization': <AddCircleOutlineIcon style={SubMenuItemStyle} />,

  // Admin Submission-lookup
  'Submission-Lookup': <FindReplaceIcon style={MenuItemStyle} />,
  'Submission Type': <DnsIcon style={SubMenuItemStyle} />,
  'Submission Period': <HourglassEmptyIcon style={SubMenuItemStyle} />,

  // Admin Role
  Role: <AppsIcon style={MenuItemStyle} />,
  'Application System': <GroupWorkIcon style={SubMenuItemStyle} />,
  'Application Role': <GroupWorkIcon style={SubMenuItemStyle} />,
  'Application System Role': <GroupWorkIcon style={SubMenuItemStyle} />,
  'Application Resource': <GroupWorkIcon style={SubMenuItemStyle} />,
  'Application Role Resource': <GroupWorkIcon style={SubMenuItemStyle} />,

  // Admin Configuration
  Configuration: <BuildIcon style={MenuItemStyle} />,

  // Admin User Management
  'User Management': <PeopleAltIcon style={MenuItemStyle} />,

  // Admin Program
  Program: <ScatterPlotIcon style={MenuItemStyle} />,

  // Admin User Role Management
  'User Role Management': <GroupAddIcon style={MenuItemStyle} />,

  // Admin Reporting Period
  'Reporting Period': <EventIcon style={MenuItemStyle} />,

  // Admin Status
  Status: <CachedIcon style={MenuItemStyle} />,

  // Admin OHFS Data Population
  'OHFS Data Populate': <StorageIcon style={MenuItemStyle} />,

  // Admin Workflow
  Workflow: <CallSplitIcon style={MenuItemStyle} />,

  // Admin Sheet Name
  'Sheet Name': <ListAltIcon style={MenuItemStyle} />,

  // Admin Auditlog
  AuditLog: <SubjectIcon style={MenuItemStyle} />,

  // UNKNOWN
  Download: <CloudDownloadIcon style={MenuItemStyle} />,
  Upload: <CloudUploadIcon style={MenuItemStyle} />,
  'Business rule configure': <ForumIcon style={MenuItemStyle} />,
  'ETL Setting': <TransitEnterexitIcon style={MenuItemStyle}/>
};
