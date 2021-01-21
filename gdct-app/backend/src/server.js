import i18n from 'i18n';
import app from './app';
import { log } from './utils/log/winston';
import AppError from './utils/AppError';
import polling from './polling';
import startTransfer from './mongoToSql'
import Container from 'typedi';
import Repository from '../src/repositories/COATree'
const repository = Container.get(Repository);

app.set('port', process.env.PORT);
const port = app.get('port');

const server = app.listen(port, () => {
  //test();
  startTransfer()
  polling();
  log.info('Listening on port', port);
  log.info('i18n test:', i18n.__('greeting'));
});

async function test(){
}

export default server;
