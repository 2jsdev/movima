import { injectable, inject } from 'inversify';
import { UseCase } from '../../../../Shared/core/UseCase';
import { UploadFilesRequestDTO } from './UploadFilesRequestDTO';
import { UploadFilesResponse } from './UploadFilesResponse';
import { left, Result, right } from '../../../../Shared/core/Result';
import { FileRepository } from '../../../domain/repositories/FileRepository';
import { FileUploaderService } from '../../services/FileUploaderService';
import { TYPES } from '../../../infrastructure/constants/types';
import { AppError } from '../../../../Shared/core/AppError';
import { File } from '../../../domain/File';
import config from '../../../infrastructure/config';

@injectable()
export class UploadFilesUseCase implements UseCase<UploadFilesRequestDTO, Promise<UploadFilesResponse>> {
  constructor(
    @inject(TYPES.FileRepository) private fileRepository: FileRepository,
    @inject(TYPES.FileUploaderService) private fileUploaderService: FileUploaderService,
  ) {}

  private async saveLocally(filesToSave, collectionIdOrName, recordId): Promise<File[]> {
    const files = await Promise.all(
      filesToSave.map(async (file) => {
        const path = `${config.get('serverUrl')}/api/files/${collectionIdOrName}/${recordId}/${file.originalname}`;
        try {
          return await this.fileRepository.search(path);
        } catch (error) {
          const fileOrError: Result<File> = File.create({ filename: file.originalname, path });
          if (fileOrError.isSuccess) {
            await this.fileRepository.save(fileOrError.getValue());
            return fileOrError.getValue();
          }
        }
      }),
    );

    return files;
  }

  private async saveRemotely(filesToSave, collectionIdOrName, recordId): Promise<File[]> {
    const mappedFiles = filesToSave.map((file) => ({
      ...file,
      localPath: file.path,
      path: `api/files/${collectionIdOrName}/${recordId}/${file.originalname}`,
    }));
    const uploadedFiles = await this.fileUploaderService.upload(mappedFiles);

    const files = await Promise.all(
      uploadedFiles.map(async ({ filename, path }) => {
        try {
          return await this.fileRepository.search(path);
        } catch (error) {
          const fileOrError: Result<File> = File.create({ filename, path });
          if (fileOrError.isSuccess) {
            await this.fileRepository.save(fileOrError.getValue());
            return fileOrError.getValue();
          }
        }
      }),
    );

    return files;
  }

  async execute(request: UploadFilesRequestDTO): Promise<UploadFilesResponse> {
    try {
      const files: File[] = !!config.get('aws.accessKeyId')
        ? await this.saveRemotely(request.files, request.collectionIdOrName, request.recordId)
        : await this.saveLocally(request.files, request.collectionIdOrName, request.recordId);

      return right(Result.ok<File[]>(files));
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
