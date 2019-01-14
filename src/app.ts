import 'reflect-metadata';

import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';

import { router } from './router';
import { logger } from './lib/logger';
import { connectToDatabase } from './config/database';

class App {
  app: express.Application;

  constructor() {
    this.app = express();
    this.configuration();

    logger.info(`environment: ${this.app.get('env')}`);
  }

  private async configuration() {
    await connectToDatabase();

    this.app.disable('x-powered-by');

    this.app.use(
      morgan('dev', {
        skip: () => this.app.get('env') === 'test',
      }),
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(router.routes);
  }
}

export default new App().app;
