# MOHLTC Data Web App Prototype

## Setup

### Local Setup

#### Database

You must have MongoDB set up locally. Install [here](https://www.mongodb.com/download-center/community).

#### Package Manager

Currently, the script commands are only set for [yarn](https://yarnpkg.com/lang/en/) (not npm).

#### Installing Dependencies

On the terminal, Run the command `yarn`. This will install slate, the application root, frontend, and backend dependencies..

#### Starting the Application

The backend is set to port 3000 and the frontend is set to port 3003. If you have any conflicts in port, adjust the ports in the [backend](/gdct-app/backend/app.js) or [frontend](/gdct-app/frontend/webpack.dev.js).

Run the command `yarn start`. Both the frontend and backend will be started. Open the application on your browser [here](http://localhost:3003).

##### Account Email verification

A test email from ```Ethereal``` is used to accept all incoming email messages.

Login with ```email: julio32@ethereal.email``` and ```password: qdjK2XgTyyHtR9zScz``` [here](https://ethereal.email/login).

## Testing

[Jest](https://jestjs.io/docs/en/tutorial-react)

