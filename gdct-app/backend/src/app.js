import express from 'express';

import 'reflect-metadata';

import { routerManager } from './controllers';
import errorHandlerController from './controllers/Error';
import { middlewares } from './middlewares';

const app = express();

middlewares(app);

routerManager(app);
// app.use(function(req,res,next){
//     // res.setHeader('Access-Control-Allow-Origin',process.env.CLIENT_SERVER);
//     // res.setHeader("Access-Control-Allow-Methods","GET,PUT,POST,DELETE");
//     // res.setHeader("Access-Control-Allow-Headers","Content-Type");
//     // next();
//   res.header("Access-Control-Allow-Origin", req.header('Origin'));
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// })


app.use(errorHandlerController);

export default app;
