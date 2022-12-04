import { User } from './../User';
import { IDomainEvent } from '../../../../Shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../Shared/domain/UniqueEntityID';

export class UserCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
