import { Container } from 'typedi';
import LoggerInstance from './logger';
//import agendaFactory from './agenda';

export default redisConnection => {
  try {
    // models.forEach(m => {
    //   Container.set(m.name, m.model);
    // });

    //const agendaInstance = agendaFactory({ mongoConnection });

    //Container.set('agendaInstance', agendaInstance);
    Container.set('logger', LoggerInstance);
    //Container.set('db', mongoConnection);
    Container.set('db', redisConnection);

    //LoggerInstance.info('✌️ Agenda injected into container');

    //return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
