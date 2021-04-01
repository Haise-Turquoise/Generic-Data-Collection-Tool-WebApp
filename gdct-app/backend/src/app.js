import express from 'express';

import 'reflect-metadata';

import { routerManager } from './controllers';
import errorHandlerController from './controllers/Error';
import { middlewares } from './middlewares';

const app = express();

middlewares(app);

routerManager(app);

app.use(errorHandlerController);

// const cors = require('cors');
// app.use(cors({ credentials: true }));

export default app;
