import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import moment from 'moment';

import ModifyOrganization from '../ModifyOrganization';
import OrgEntity from '../../../../../backend/src/entities/Organization/entity';
import { createOrgsRequest } from '../../../store/thunks/organization';
import CreateAuditLog from '../../AuditLog_Global';

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

  const submit = organization => {
    new Promise((resolve, reject) => {
      dispatch(createOrgsRequest(organization, resolve, reject));
    }).then(newOrganization => {
      // For Auditlog
      CreateAuditLog(null, "Create Organization", "Organization", newOrganization._id, {}, newOrganization);
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
