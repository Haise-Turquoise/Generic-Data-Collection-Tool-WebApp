import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ModifyOrganization from '../ModifyOrganization';

import { updateOrgsRequest, getOrgsRequest } from '../../../store/thunks/organization';
import { selectOrgsStore } from '../../../store/OrganizationsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../../store/common/REST/selectors';

import orgController from '../../../controllers/organization';
import CreateAuditLog from '../../AuditLog_Global';

const EditOrganization = ({
  match: {
    params: { _id },
  },
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrgsRequest());
  }, [dispatch]);

  // Prepare the data
  const { object } = useSelector(state => ({
    object: (selectFactoryRESTResponseTableValues(selectOrgsStore)(state).filter(
      elem => elem._id === _id,
    ) || [{}])[0],
  }));

  const redirect = () => { history.push('/admin/organization/org') };

  const accept = () => { redirect() };

  const reject = () => { alert('Missing or invalid parameters') };

  const submit = newOrganization => { // This newOrgnization does not contain "_id" required for update (it does contain the artificial "id")
    (async () => {
      // Find the old value before updating in order to Auditlog
      const oldOrganization = await orgController.fetchById(newOrganization.id);
      CreateAuditLog(null, "Update Organization", "Organization", oldOrganization._id, oldOrganization, newOrganization);
      // Add _id and trim tableData created by Material Table
      newOrganization["_id"] = oldOrganization._id;
      const organization_trim = (({ tableData, ...o }) => o)(newOrganization);
      // Update
      dispatch(updateOrgsRequest(organization_trim, accept, reject));
    })();
  };

  const cancel = () => {
    redirect();
  };

  return (
    <div>
      <ModifyOrganization
        title={'Edit Organization'}
        object={object}
        submit={submit}
        cancel={cancel}
      />
    </div>
  );
};

EditOrganization.propTypes = {
  match: PropTypes.object,
};

export default EditOrganization;
