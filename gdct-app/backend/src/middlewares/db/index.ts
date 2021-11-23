import mongoose from 'mongoose';
import { log } from '../../utils/log/winston';

const logTag = `[${__filename}][DB]: `;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// TODO: DO NOT LOAD REPOSITORIES HERE - Singleton database connection
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export default class Database {
  connect() {
    log.info(logTag, 'Initializing...');

    this.initializeMongoose();
  }

  disconnect() {
    mongoose.disconnect();
  }

  /**
   * Connects to and creates the configuration for the database
   */
  initializeMongoose() {
    log.info(logTag, 'Connecting...');

    mongoose.connect(process.env.DATABASE_KEY!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    log.info(logTag, 'Connection successful');
  }
}

export const dbUtil = new Database();
