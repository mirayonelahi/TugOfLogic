import 'reflect-metadata'; // We need this in order to use @Decorators
import config from './config';
import express from 'express';
import Logger from './loaders/logger';

async function startServer() {
  const app = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/

  const options = <any>{};
  const transport_module = 'http';

  // if (config.ssl_cert_path && config.ssl_key_path){
  //   options.cert = fs.readFileSync(config.ssl_cert_path);
  //   options.key = fs.readFileSync(config.ssl_key_path);
  //   transport_module = 'https';
  // }

  const server = require(transport_module).createServer(options, app);
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    },
  });

  await require('./loaders').default({ expressApp: app });
  await require('./socket').default({ io });

  app.listen = function () {
    Logger.info(`Server socket is now listening on ${config.port}`);
    return server.listen.apply(server, arguments);
  };

  app
    .listen(config.port, () => {
      Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
