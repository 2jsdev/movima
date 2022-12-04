import { UniqueEntityID } from '../../../../Shared/domain/UniqueEntityID';
import { Mapper } from '../../../../Shared/infrastructure/Mapper';
import { File } from '../../../domain/File';

export class FileMapper implements Mapper<File> {
  public static toDTO(file: File): any {
    return {
      id: file.fileId.id.toString(),
      filename: file.filename,
      path: file.path,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt || null,
    };
  }

  public static toDomain(raw: any): File {
    const fileOrError = File.create(
      {
        filename: raw.filename,
        path: raw.path,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at || null,
      },
      new UniqueEntityID(raw.id),
    );

    fileOrError.isFailure && console.log(fileOrError.getErrorValue());

    return fileOrError.isSuccess ? fileOrError.getValue() : null;
  }

  public static toPersistence(raw: File): any {
    return {
      id: raw.fileId.id.toString(),
      filename: raw.filename,
      path: raw.path,
      created_at: raw.createdAt,
      updated_at: raw.updatedAt || null,
    };
  }
}
