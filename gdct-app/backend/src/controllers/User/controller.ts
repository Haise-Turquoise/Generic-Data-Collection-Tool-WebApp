import { Service } from 'typedi';
import { Router } from 'express';
import UserService from '../../services/User';

/**
IMPORTANT NOTE:
Every backend service need to handle response by Response methods and error
If response is not handled, the backend buffer will overflow after several hanging(pending) requests
And the frontend and backend will be disconnected

https://expressjs.com/en/guide/routing.html :
Response methods
The methods on the response object (res) in the following table can send a response to the client, 
and terminate the request-response cycle. 
If none of these methods are called from a route handler, the client request will be left hanging.
**/
const UserController = Service([UserService], service => {
  const router = Router();

  return (function () {
    router.post(`/users/registerUser`, (req, res, next) => {
      const { userData } = req.body;
      service.register(userData)
      .then(() => res.json({ message: 'router.put /users/registerUser' }))
      .catch(next);
    });

    // User Profile Update
    router.put(`/updatePopulatedUser`, (req, res, next) => {
      const { userData } = req.body;
      const _id = userData._id;
      
      service
        .modifyUserInfo(_id, userData)
        .then(() => res.json({ message: 'router.put /updatePopulatedUser' }))
        .catch(next);
    });

    
    // User toBeApproved Array Update
    router.put(`/updateToBeApprovedUser`, (req, res, next) => {
      const { userData } = req.body;
      const _id = userData._id;
      
      service
        .modifyUserToBeApproved(_id, userData)
        .then(() => res.json({ message: 'router.put updateToBeApprovedUser' }))//see IMPORTANT NOTE above
        .catch(next);
    });

    // User PendingPermissions Array Update
    router.put(`/updatePendingPermissions`, (req, res, next) => {
      const { userData } = req.body;
      const _id = userData._id;
          
      service
        .modifyUserPendingPermissions(_id, userData)
        .then(() => res.json({ message: 'router.put updatePendingPermissions' }))
        .catch(next);
    });

    router.post(`/fetchUserByUserName`, (req, res, next) => {
      const { username } = req.body;

      service
        .fetchUserByUserName(username)
        .then(user => res.json({ user }))
        .catch(next);
    });

    router.post(`/fetchUserByEmail`, (req, res, next) => {
      const { email } = req.body;

      service
        .fetchUserByEmail(email)
        .then(user => res.json({ user }))
        .catch(next);
    });

    router.get(`/users/verifyUser`, (req, res, next) => {
      const { approve, _id, hashedUsername, orgId } = req.query;
      service
        .sendActiveEmail(approve, _id, orgId)
        .then(() => res.json({ message: 'You have processed the email' }))
        .catch(next);
    });

    router.get(`/users/verifyNewUserPermission`, (req, res, next) => {
      const { approve, _id, hashedUsername, orgId } = req.query;
      service
        .sendUserPermissionActiveEmail(approve, _id, orgId)
        .then(() => res.json({ message: 'You have processed the email' }))
        .catch(next);
    });

    router.post(`/users/deletePermission`, (req, res, next) => {
      const { email, permissionData } = req.body;
      console.log(email, permissionData)
      service
        .deleteUserPermission(email, permissionData)
        .then(() => res.json({ message: 'Permission successfully deleted' }))
        .catch(next);
    });

    router.post(`/users/updatePermission`, (req, res, next) => {
      const { email, permissionData } = req.body;
      service
      .updatePermissionByUserEmail(email, permissionData)
      .then(() => res.json({ message: 'router.put /users/updatePermission' }))
      .catch(next);
    });
    router.get(`/users/activeUser`, (req, res, next) => {
      const { _id, hashedUsername } = req.query;
      service
        .activeUser(_id)
        .then(() => res.json({ message: 'You have activated the account' }))
        .catch(next);
    });

    router.post(`/users/updatePassword`, (req, res, next) => {
      const { email, password } = req.body;
      service
      .updatePasswordByUserEmail(email, password)
      .then(() => res.json({ message: 'Password is successfully changed' }))
      .catch(next);
    });

    return router;
  })();
});

export default UserController;
