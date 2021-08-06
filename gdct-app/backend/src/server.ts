//@ts-ignore
import i18n from 'i18n';
import app from './app';
import { log } from './utils/log/winston';

app.set('port', process.env.PORT);
const port = app.get('port');

const server = app.listen(port, () => {
  // polling();
  log.info('Listening on port', port);
  log.info('i18n test:', i18n.__('greeting'));
});

export default server;
