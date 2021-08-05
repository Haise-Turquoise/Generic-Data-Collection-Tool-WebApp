import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { Paper, Typography, Button } from '@material-ui/core';
import Loading from '../../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import AppButtonList from '../AppButtonList';
import roleSubmissionButtonController from '../../../controllers/RoleSubmissionButton';
import RoleSubmissionButton from '../../../types/rolesubmissionbutton';
type propType = { role: string }
type nameObj = { name: string }

const AppRoleButtonManagementHeader = ({
  match: {
    params: { role },
  },
}: RouteComponentProps<propType>) => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Button Management</Typography>
      <Typography variant="body1">{role}</Typography>
      {/* <HeaderActions/> */}
    </Paper>
  );
};

const LinkProgramTable = ({
  match: {
    params: { role },
  },
}: RouteComponentProps<propType>) => {
  const [roleSubmissionButton, setRoleSubmissionButton] =
    useState<RoleSubmissionButton | undefined>(undefined)

  useEffect(() => {
    console.log('ROLE', role.replace("_", " "))
    roleSubmissionButtonController.fetchSubmissionButtonByRole(role.replace("_", " "))
      .then(res => {
          if (res) {
          setRoleSubmissionButton(res)
        } else {
          setRoleSubmissionButton({
            button: [],
            role: 'Not Found',
          })
        }
      }).catch(() => setRoleSubmissionButton({
        button: [],
        role: 'Not Found'
      }))
  }, [])

  const onClickAdd = (_: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData) || !roleSubmissionButton) {
      return
    }
    setRoleSubmissionButton(prev => {
      const copy: RoleSubmissionButton = {...prev!}
      copy.button = copy.button.concat([rowData.name])
      roleSubmissionButtonController.update(copy)
      return copy
    })
  };

  const onClickDelete = (_: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData) || !roleSubmissionButton) {
      return
    }
    setRoleSubmissionButton(prev => {
      const copy: RoleSubmissionButton = {...prev!}
      copy.button = copy.button.filter(name => name !== rowData.name)
      roleSubmissionButtonController.update(copy)
      return copy
    })
  };

  const history = useHistory();
  const redirect = () => {
    history.push('/admin/role/app_role_button_management');
  };

  return !roleSubmissionButton ? (
    <Loading message={'Loading...'} />
  ) : (
    <div>
      <AppButtonList
        role={role}
        onClickAdd={onClickAdd}
        onClickDelete={onClickDelete}
      />
      <Button onClick={redirect} variant="contained" color="primary" style={{ marginTop: '0.8%' }}>
        <ArrowBackIcon></ArrowBackIcon>
        Back
      </Button>
    </div>
  );
};


const AppRoleButtonManagement = (props: RouteComponentProps<propType>) => (
  <div className="templateTypePage">
    <AppRoleButtonManagementHeader {...props} />

    <LinkProgramTable {...props} />
  </div>
);

export default AppRoleButtonManagement;
