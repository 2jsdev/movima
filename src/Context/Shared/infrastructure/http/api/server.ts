import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import compress from 'compression';
import config from '../../config';
import { container } from '../../ioc/container';

import '../../../../FileStorage/infrastructure/http/api/controllers';
import '../../../../Cms/Users/infrastructure/http/api/controllers';
import '../../persistence/sequelize';
import '../../../../Cms/Users/domain/subscriptions';

class Server {
  private server;
  private port: number;

  constructor() {
    this.server = new InversifyExpressServer(container);
    this.port = parseInt(process.env.PORT, 10) || 4000;
  }
  start(): void {
    this.server.setConfig((app) => {
      app.use(
        cors({
          origin: config.get('appUrl'),
          credentials: true,
        }),
      );
      app.use(helmet());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(helmet.xssFilter());
      app.use(helmet.noSniff());
      app.use(helmet.hidePoweredBy());
      app.use(helmet.frameguard({ action: 'deny' }));
      app.use(compress());
      app.use(express.static('.'));
    });

    const application = this.server.build();

    application.listen(this.port, () => {
      console.log(`[App]: The App is running at ${config.get('serverUrl')}`);
      console.log('[App]: Press CTRL-C to stop\n');
    });
  }
}

export default Server;
