import { Container } from 'inversify';

import { container as UserContainer } from '../../../Cms/Users/infrastructure/ioc/container';
import { container as fileStorageContainer } from '../../../FileStorage/infrastructure/ioc/container';

const container = Container.merge(fileStorageContainer, UserContainer);

export { container };
