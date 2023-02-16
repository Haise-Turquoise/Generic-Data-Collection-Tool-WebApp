import React, { useEffect, useState } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { Paper, Typography, Button } from '@material-ui/core';
import Loading from '../../../components/Loading';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import AppWorkflowList from '../AppWorkflowList';
import roleWorkflowStatusController from '../../../controllers/RoleWorkflowStatus';
import AppRoleController from '../../../controllers/AppRole';
import RoleWorkflowStatus from '../../../types/roleWorkflowStatus';
import Swal from 'sweetalert2';
type propType = { role: string }
type nameObj = { name: string }

const AppRoleWorkflowStatusManagementHeader = ({
  match: {
    params: { role },
  },
}: RouteComponentProps<propType>) => {
  return (
    <Paper className="header">
      <Typography variant="h5">App Role Workflow Management</Typography>
      <Typography variant="body1">{role}</Typography>
    </Paper>
  );
};

const LinkProgramTable = ({
  match: {
    params: { role },
  },
}: RouteComponentProps<propType>) => {
  const [roleWorkflowStatus, setRoleWorkflowStatus] =
    useState<RoleWorkflowStatus | undefined>(undefined)

  useEffect(() => {
    (
      async () => {
        let found: RoleWorkflowStatus | null = null
        try {
          found = await roleWorkflowStatusController.fetchStatusByRole(role.replace("_", " "))
          
          if (found) {
            setRoleWorkflowStatus(found)
          } else {
            throw new Error('go to catch block')
          }
        } catch (e) {
          const appRoles = await AppRoleController.fetch()
          const names = appRoles.map(role => (role.name))
          if (names.includes(role.replace("_", " "))) {
            setRoleWorkflowStatus({
              role: 'Create Me',
              workflowStatus: [],
              modifiedOn: '',
              updatedBy: '',
            })
          } else {
            setRoleWorkflowStatus({
              role: 'Not Found',
              workflowStatus: [],
              modifiedOn: '',
              updatedBy: '',
            })
          }
        }
      }
    )()
  }, [])

  useEffect(() => {
    if (roleWorkflowStatus?.role === 'Create Me') {
      // create new one
      Swal.fire({
        title: 'Resource Not Found',
        text: 'Would you like to create it?',
        showDenyButton: true,
        denyButtonText: 'Return',
        confirmButtonText: 'Create',
        icon: 'question',
      }).then(res => {
        if (res.isConfirmed) {
          // create the resource
          roleWorkflowStatusController.create({
            role: role.replace("_", " "),
            workflowStatus: [],
            modifiedOn: new Date().toLocaleString(),
            updatedBy: localStorage.getItem('currentUser') || ''
          }).then(res => {
            setRoleWorkflowStatus(res)
            return
          })
        } else {
          redirect();
          return
        }
      })
    } else if (roleWorkflowStatus?.role === 'Not Found') {
      Swal.fire({
        title: 'Resource Not Found',
        icon: 'error',
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: 'Return',
      }).then(_res => redirect())
    }
  }, [roleWorkflowStatus])

  const onClickAdd = (_: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData) || !roleWorkflowStatus) {
      return
    }
    setRoleWorkflowStatus(prev => {
      if (!prev?._id) {
        return
      }
      const copy: RoleWorkflowStatus = {
        ...prev!,
        modifiedOn: new Date().toLocaleString(),
        updatedBy: localStorage.getItem('currentUser') || ''
      }
      copy.workflowStatus = copy.workflowStatus.concat([rowData.name])
      roleWorkflowStatusController.update(copy._id!, copy)
      return copy
    })
  };

  const onClickDelete = (_: any, rowData: nameObj | nameObj[]) => {
    if (Array.isArray(rowData) || !roleWorkflowStatus) {
      return
    }
    setRoleWorkflowStatus(prev => {
      if (!prev?._id) {
        return
      }
      const copy: RoleWorkflowStatus = {
        ...prev!,
        modifiedOn: new Date().toLocaleString(),
        updatedBy: localStorage.getItem('currentUser') || ''
      }
      copy.workflowStatus = copy.workflowStatus.filter(name => name !== rowData.name)
      roleWorkflowStatusController.update(copy._id!, copy)
      return copy
    })
  };

  const history = useHistory();
  const redirect = () => {
    history.push('/admin/role/app_role_workflow_management');
  };

  return !roleWorkflowStatus ? (
    <Loading message={'Loading...'} />
  ) : (
    <div>
      <AppWorkflowList
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


const AppRoleWorkflowStatusManagement = (props: RouteComponentProps<propType>) => (
  <div className="templateTypePage">
    <AppRoleWorkflowStatusManagementHeader {...props} />

    <LinkProgramTable {...props} />
  </div>
);

export default AppRoleWorkflowStatusManagement;
