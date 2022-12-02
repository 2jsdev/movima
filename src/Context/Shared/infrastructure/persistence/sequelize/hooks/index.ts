import models from '../models';
import { UniqueEntityID } from '../../../../domain/UniqueEntityID';
import { DomainEvents } from '../../../../domain/events/DomainEvents';

const dispatchEventsCallback = (model, primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(model[primaryKeyField]);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
};

(async function createHooksForAggregateRoots() {
  const { File } = models;

  File.addHook('afterCreate', (m: any) => dispatchEventsCallback(m, 'id'));
  File.addHook('afterDestroy', (m: any) => dispatchEventsCallback(m, 'id'));
  File.addHook('afterUpdate', (m: any) => dispatchEventsCallback(m, 'id'));
  File.addHook('afterSave', (m: any) => dispatchEventsCallback(m, 'id'));
  File.addHook('afterUpsert', (m: any) => dispatchEventsCallback(m, 'id'));

  console.log('[Hooks]: Sequelize hooks setup.');
})();
