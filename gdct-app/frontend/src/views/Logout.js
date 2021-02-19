import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthController from '../controllers/Auth';
import AuditLogController from '../controllers/AuditLog'

export default function Logout({ setLoggedIn }) {
  const history = useHistory();

  var node = document.getElementById('MuiChip-label-Authpage');
  const email = node.textContent;
  useEffect(() => {
    AuthController.logout(email).then(res => {
      if (res.status === 'ok') {
        setLoggedIn(false);
        history.push('/');
        // Audit Log Below -----------------------------------------------------------------------------------------------------------------------------
        // Construct info required for this auditlogs
        const IdentitiesWithNoRole = ["Business Admin", "Template Designer", "Template Approver"]
        const AuditLogInfo = {
          user: {
            _id: res.data._id,
            email: res.data.email,
            orgId: !(IdentitiesWithNoRole.includes(res.data.sysRole[0].role)) && res.data.sysRole[0].org.length > 0 ? res.data.sysRole[0].org[0].orgId : ""
          },
          activity: "Logout",
          moduleName: "Logout",
          recordId: null,
          oldValue: {},
          newValue: {}
        }
        // Call AuditLog create service
        async function createAuditLog() {
          return await AuditLogController.create(AuditLogInfo)
        }
        (async () => {
          await createAuditLog();
        })()
        // Audit Log Above -----------------------------------------------------------------------------------------------------------------------------
      }
    });
  }, []);
  return null;
}
