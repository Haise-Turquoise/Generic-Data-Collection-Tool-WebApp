import usersController from '../controllers/Users'
import AuditLogController from '../controllers/AuditLog'

// A global function for all views that may generate changes to the database.
const CreateAuditLog = (email, activity, moduleName, recordId, oldValue, newValue) => {
    // Get User Email for finding specific user
    if (email === null) { // null means that the user is not currently logging in or out, which means email is in local storage
        email = localStorage.getItem('currentUser');
    }
    (async () => {
        // Get the user
        const user = await usersController.fetchByEmail({email});
        const IdentitiesWithNoOrg = ["Business Admin", "Template Designer", "Template Approver"]
        // No need for attributes: _id and __v in objects
        const oldValue_trim = (({ _id, __v, ...o }) => o)(oldValue);
        const newValue_trim = (({ _id, __v, ...o }) => o)(newValue);
        // Construct info required for this auditlogs
        const AuditLogInfo = {
            user: {
                _id: user._id,
                email: user.email,
                orgId: !(IdentitiesWithNoOrg.includes(user.sysRole[0].role)) && user.sysRole[0].org.length > 0 ? user.data.sysRole[0].org[0].orgId : ""
            },
            activity: activity,
            moduleName: moduleName,
            recordId: recordId,
            oldValue: oldValue_trim,
            newValue: newValue_trim,
        };
        // Create Auditlog
        (async () => { await AuditLogController.create(AuditLogInfo) })();
    })();
}

export default CreateAuditLog;
