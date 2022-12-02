import { Container } from 'inversify';

// Services
import { AWSFileUploader } from '../services/AWSFileUploader';

// Use cases
import { UploadFilesUseCase } from '../../application/useCases/uploadFiles/UploadFilesUseCase';

// Repositories
import { SequelizeFileRepository } from '../persistence/sequelize/SequelizeFileRepository';

// Types
import { TYPES } from '../constants/types';

const container = new Container();

// Services
container.bind(TYPES.FileUploaderService).to(AWSFileUploader).inSingletonScope();

// Use cases
container.bind<UploadFilesUseCase>(TYPES.UploadFilesUseCase).to(UploadFilesUseCase);

// Repositories
container.bind(TYPES.FileRepository).to(SequelizeFileRepository).inSingletonScope();

export { container };
