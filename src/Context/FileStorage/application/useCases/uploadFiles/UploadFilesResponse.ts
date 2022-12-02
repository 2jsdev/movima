import { AppError } from '../../../../Shared/core/AppError';
import { Either, Result } from '../../../../Shared/core/Result';
import { File } from '../../../domain/File';

export type UploadFilesResponse = Either<AppError.UnexpectedError, Result<File[]>>;
