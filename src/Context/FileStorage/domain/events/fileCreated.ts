import { File } from '../File';
import { IDomainEvent } from '../../../Shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../Shared/domain/UniqueEntityID';

export class FileCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public file: File;

  constructor(file: File) {
    this.dateTimeOccurred = new Date();
    this.file = file;
  }

  getAggregateId(): UniqueEntityID {
    return this.file.id;
  }
}
