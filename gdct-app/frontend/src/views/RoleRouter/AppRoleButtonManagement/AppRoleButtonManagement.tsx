import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { Paper, Typography, Button } from '@material-ui/core';
import Loading from '../../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import AppButtonList from '../AppButtonList';
import roleSubmissionButtonController from '../../../controllers/RoleSubmissionButton';
import RoleSubmissionButton from '../../../types/rolesubmissionbutton';
import Swal from 'sweetalert2';
import AppRoleController from '../../../controllers/AppRole';
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
      (
        async () => {
          let found: RoleSubmissionButton | null = null
          try {
            found = await roleSubmissionButtonController.fetchSubmissionButtonByRole(role.replace("_", " "))
            
            if (found) {
              setRoleSubmissionButton(found)
            } else {
              throw new Error('go to catch block')
            }
          } catch (e) {
            const appRoles = await AppRoleController.fetch()
            const names = appRoles.map(role => (role.name))
            if (names.includes(role.replace("_", " "))) {
              setRoleSubmissionButton({
                role: 'Create Me',
                button: [],
                updatedBy: '',
                modifiedOn: ''
              })
            } else {
              setRoleSubmissionButton({
                role: 'Not Found',
                button: [],
                updatedBy: '',
                modifiedOn: ''
              })
            }
          }
        }
      )()
    }, [])
  
    useEffect(() => {
      if (roleSubmissionButton?.role === 'Create Me') {
        // create new one
          if (true) {
            // create the resource
            roleSubmissionButtonController.create({
              role: role.replace("_", " "),
              button: [],
              updatedBy: localStorage.getItem('currentUser') || '',
              modifiedOn: new Date().toLocaleString()
            }).then(res => {
              setRoleSubmissionButton(res)
              window.location.reload();
              return
            })
          }
      } else if (roleSubmissionButton?.role === 'Not Found') {
        Swal.fire({
          title: 'Resource Not Found',
          icon: 'error',
          showConfirmButton: false,
          showDenyButton: true,
          denyButtonText: 'Return',
        }).then(_res => redirect())
      }
    }, [roleSubmissionButton])

  const onClickAdd = (_: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData) || !roleSubmissionButton) {
      return
    }
    setRoleSubmissionButton(prev => {
      const copy: RoleSubmissionButton = {
        ...prev!,
        modifiedOn: new Date().toLocaleString(),
        updatedBy: localStorage.getItem('currentUser') || ''
      }
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
      const copy: RoleSubmissionButton = {
        ...prev!,
        modifiedOn: new Date().toLocaleString(),
        updatedBy: localStorage.getItem('currentUser') || ''
      }
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
