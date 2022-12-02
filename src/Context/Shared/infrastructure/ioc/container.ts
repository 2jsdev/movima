import { Container } from 'inversify';
import { container as fileStorageContainer } from '../../../FileStorage/infrastructure/ioc/container';

const commonContainer = new Container();

const container = Container.merge(fileStorageContainer, commonContainer);

export { container };
