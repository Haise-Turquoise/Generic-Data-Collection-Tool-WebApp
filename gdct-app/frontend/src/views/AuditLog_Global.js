import usersController from '../controllers/Users'
import AuditLogController from '../controllers/AuditLog'

// A global function for (nearly) all views that may generate changes to the database.
const CreateAuditLog = (email, activity, moduleName, recordId, oldValue, newValue) => {
    // Get User Email for finding specific user
    if (email === null) { // null means that the user is not currently logging in or out, which means Chip is available
        var node = document.getElementById('MuiChip-label');
        email = node.textContent;
        console.log(email);
    }
    // Find User
    async function getUserByUserEmail() {
        return usersController.fetchUserByUserEmail(email);
    };
    (async () => {
        const user = await getUserByUserEmail();
        console.log(user)
        // Construct info required for this auditlogs
        const IdentitiesWithNoRole = ["Business Admin", "Template Designer", "Template Approver"]
        const AuditLogInfo = {
            user: {
                _id: user._id,
                email: user.email,
                orgId: !(IdentitiesWithNoRole.includes(user.sysRole[0].role)) && user.sysRole[0].org.length > 0 ? user.data.sysRole[0].org[0].orgId : ""
            },
            activity: activity,
            moduleName: moduleName,
            recordId: recordId,
            oldValue: oldValue,
            newValue: newValue,
        };
        // Call AuditLog create service
        async function createAuditLog() {
            return await AuditLogController.create(AuditLogInfo)
        };
        (async () => {
            await createAuditLog();
        })();
    })();
}

export default CreateAuditLog;
