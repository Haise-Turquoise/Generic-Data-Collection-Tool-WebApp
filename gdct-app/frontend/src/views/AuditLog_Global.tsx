import AuditLogController from '../controllers/AuditLog';

// A global function for all views that may generate changes to the database.
const CreateAuditLog = async (
    email: string | null,
    activity: string,
    moduleName: string,
    recordId: string | null | undefined,
    oldValue: {[key: string]: any} | null,
    newValue: {[key: string]: any}
  ) => {
  // Get User Email for finding specific user
  if (email === null) {
    // null means that the user is not currently logging in or out, which means email is in local storage
    email = localStorage.getItem('currentUser') || '';
  }
  // No need for attributes: _id and __v in objects
  const oldValue_trim = (({ _id, __v, ...o }) => o)(oldValue || {_id: '', __v: ''});
  const newValue_trim = (({ _id, __v, ...o }) => o)(newValue);
  // Construct info required for this auditlogs
  const AuditLogInfo = {
    user: {
      _id: localStorage.getItem('currentUserID') || '',
      email,
    },
    activity,
    moduleName,
    recordId,
    oldValue: oldValue_trim,
    newValue: newValue_trim,
  };
  // Create Auditlog
  await AuditLogController.create(AuditLogInfo);
};

export default CreateAuditLog;
