import app from './app';
import { log } from './utils/log/winston';

app.set('port', process.env.PORT);
const port = app.get('port');

const server = app.listen(port, () => {
  log.info('Listening on port', port);
});

export default server;
