import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import redisLoader from './redis';
import Logger from './logger';
//We have to import at least all the events once so they can be triggered

export default async ({ expressApp }) => {
  const redisConnection = await redisLoader();
  Logger.info('✌️ DB loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  // const userModel = {
  //   name: 'userModel',
  //   // Notice the require syntax and the '.default'
  //   model: require('../models/user').default,
  // };

  // const GameModel = {
  //   name: 'GameModel',
  //   model: require('../models/game').default,
  // };

  // It returns the agenda instance because it's needed in the subsequent loaders
  // const { agenda } = await dependencyInjectorLoader({
  //   models: [
  //     userModel,
  //     GameModel
  //     // salaryModel,
  //     // whateverModel
  //   ],
  // });
  dependencyInjectorLoader(redisConnection);
  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
