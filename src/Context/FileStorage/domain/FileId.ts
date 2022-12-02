import { Entity } from '../../Shared/domain/Entity';
import { UniqueEntityID } from '../../Shared/domain/UniqueEntityID';
import { Result } from '../../Shared/core/Result';

export class FileId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<FileId> {
    return Result.ok<FileId>(new FileId(id));
  }
}
