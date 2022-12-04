import { Result } from '../../../Shared/core/Result';
import { Entity } from '../../../Shared/domain/Entity';
import { UniqueEntityID } from '../../../Shared/domain/UniqueEntityID';

export class UserId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): Result<UserId> {
    return Result.ok<UserId>(new UserId(id));
  }
}
