import { injectable } from 'inversify';
import { FileRepository } from '../../../domain/repositories/FileRepository';
import { File } from '../../../domain/File';
import { FileMapper } from './FileMapper';
import models from '../../../../Shared/infrastructure/persistence/sequelize/models';

@injectable()
export class SequelizeFileRepository implements FileRepository {
  private models: any;
  constructor() {
    this.models = models;
  }

  async exists(fileId: string): Promise<boolean> {
    const FileModel = this.models.File;
    const file = await FileModel.findByPk(fileId);

    return !!file === true;
  }

  async search(path: string): Promise<File> {
    const FileModel = this.models.File;
    const file = await FileModel.findOne({
      where: { path },
    });
    if (!!file === false) throw new Error('File not found.');
    return FileMapper.toDomain(file);
  }

  async save(file: File): Promise<void> {
    const FileModel = this.models.File;
    try {
      const exists = await this.exists(file.id.toString());
      if (!exists) {
        const rawSequelizeUser = await FileMapper.toPersistence(file);
        await FileModel.create(rawSequelizeUser);
      }
      return;
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  async saveBulk(files: File[]): Promise<void> {
    for (let file of files) {
      await this.save(file);
    }
  }
}
