# Setup

## Local Setup

### Requirements

#### Database

You must have MongoDB set up locally. Install [here](https://www.mongodb.com/download-center/community).

#### Package Manager

Currently, the script commands are only set for [yarn](https://yarnpkg.com/lang/en/) (not npm).

#### Installing Dependencies

Run the command `yarn deps`. This will install the root, frontend, and backend dependencies.

#### Starting the Application

The backend is set to port 3000 and the frontend is set to port 3003. If you have any conflicts in port, adjust the ports in the [backend](/backend/app.js) or [frontend](/frontend/webpack.dev.js).

Run the command `yarn dev`. Both the frontend and backend will be started. Open the application on your browser [here](http://localhost:3003).

##### Admin Access

A dummy admin is automatically created, with the ```username: sampleuser``` and  ```password: password123@```.

##### Account Email verification

A test email from ```Ethereal``` is used to accept all incoming email messages.

Login with ```email: julio32@ethereal.email``` and ```password: qdjK2XgTyyHtR9zScz``` [here](https://ethereal.email/login).
