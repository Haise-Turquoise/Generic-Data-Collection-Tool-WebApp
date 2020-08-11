import nodemailer from 'nodemailer';

import { mailConfig } from '../../middlewares/mail/nodeMailer';

// Check your messages at https://ethereal.email/ on the test email account
// Credentials are present on mailConfig
const transporter = nodemailer.createTransport(mailConfig);

export const sendUserVerficationEmail = registerData => {
  const { username, email } = registerData;
  const message = {
    from: 'julio32@ethereal.email',
    to: email,
    subject: 'Web-prototype User Email Verification',
    // text: `Hello ${username}! Activate your account here by going to this url: ${FRONTEND_SERVER}/verification/${id}`,
    html: `<p><b>Hello ${username}</b> 
        <br/>Your request has been received.
        <br/>Approval by an authorizing person for the above access(es) is required.
        <br/>You will be notified via email when your request has been approved.
        <br/>Thank you.The System has send email to authorized person to approve</p>`,
  };

  return transporter
    .sendMail(message)
    .then(info => ({ message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` }));
};

export const sendAdminVerficationEmail = (orgInfo, hashedUsername, userId, username) => {
  const { authorizedPerson, orgId, permission } = orgInfo;
  const orgName = orgInfo.name;
  const { name, telephone, email } = authorizedPerson;

  const stringList = [];
  permission.forEach(e => {
    stringList.push(JSON.stringify(e));
  });
  stringList.join('<br/>');
  console.log(stringList);
  const message = {
    from: 'julio32@ethereal.email',
    to: email,
    subject: 'Web-prototype Admin Email Verification',
    // text: `Hello ${username}! Activate your account here by going to this url: ${FRONTEND_SERVER}/verification/${id}`,
    html: `<p><b>Hello ${name}</b> 
       
        <br/> We have received a request(${username}) to create a user account for the following role:
        <br/> ${stringList}
        <br/> from the following individual in your organization:
        <br/> Organization: ${orgName},
        <br/> Name:         ${name},
        <br/> Phone:        ${telephone},
        <br/> Email:        ${email},
        <br/> To approve this request, click the link below: 
        <br/> <a href='${process.env.HOST}/user_management/users/verifyUser?approve=true&hashedUsername=${hashedUsername}&_id=${userId}&orgId=${orgId}'> Approve </a>
        <br/> To reject this request, click the link below:
        <br/> <a href='${process.env.HOST}/user_management/users/verifyUser?approve=false&hashedUsername=${hashedUsername}&_id=${userId}&orgId=${orgId}'> Reject </a>
        </p>`,
  };

  return transporter
    .sendMail(message)
    .then(info => ({ message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` }));
};

export const sendUserActiveEmail = user => {
  const { username, hashedUsername, _id, email } = user;
  const message = {
    from: 'julio32@ethereal.email',
    to: email,
    subject: 'Web-prototype User Email Verification',
    // text: `Hello ${username}! Activate your account here by going to this url: ${FRONTEND_SERVER}/verification/${id}`,
    html: `<p><b>Hello ${username}</b> 
        <br/>Your request has been processed.
        <br/>In order to access the site, you need activate your account.
        <br/>To activate your account, click the link below:
        <br/> <a href='${process.env.HOST}/user_management/users/activeUser?hashedUsername=${hashedUsername}&_id=${_id}'> Active </a></p>`,
  };

  return transporter
    .sendMail(message)
    .then(info => ({ message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` }));
};

export const sendUserRejectEmail = user => {
  const { username, email } = user;
  const message = {
    from: 'julio32@ethereal.email',
    to: email,
    subject: 'Web-prototype User Email Verification',
    // text: `Hello ${username}! Activate your account here by going to this url: ${FRONTEND_SERVER}/verification/${id}`,
    html: `<p><b>Hello ${username}</b> 
        <br/>Your request has been rejected.<p>`,
  };

  return transporter
    .sendMail(message)
    .then(info => ({ message: `Preview URL: ${nodemailer.getTestMessageUrl(info)}` }));
};
