import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import moment from 'moment';

import ModifyOrganization from '../ModifyOrganization';
//@ts-ignore
import OrgEntity from '../../../../../backend/src/entities/Organization/entity';
//@ts-ignore
import { createOrgsRequest } from '../../../store/thunks/organization';
//@ts-ignore
import CreateAuditLog from '../../AuditLog_Global';
import Organization from '../../../types/organization'

const CreateOrganization = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  // @ts-ignore
  const initialState = new OrgEntity({
    active: true,
    programId: [],
    effectiveDate: moment().format(),
    expiryDate: null,
  });

  // After successfully create the organization, the new info will be store to the database and push back to the main 
  // page of organization with new data showing on page.
  const redirect = () => {
    history.push('/admin/organization/org');
  };

  const submit = (organization: Organization) => {
    new Promise((resolve, reject) => {
      dispatch(createOrgsRequest(organization, resolve, reject));
    }).then((newOrganization) => {
      // For Auditlog
      if (newOrganization) {
        CreateAuditLog(null, "Create Organization", "Organization", (newOrganization as Organization)._id, {}, newOrganization);
      }
      // Redirect back after creation
      redirect();
    })
  };

  const cancel = () => {
    redirect();
  };
  return (
    <div>
      <ModifyOrganization
        title={'Create Organization'}
        object={initialState}
        submit={submit}
        cancel={cancel}
      />
    </div>
  );
};

export default CreateOrganization;
