import { Guard } from '../../Shared/core/Guard';
import { Result } from '../../Shared/core/Result';
import { AggregateRoot } from '../../Shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../Shared/domain/UniqueEntityID';
import { FileCreated } from './events/fileCreated';
import { FileId } from './FileId';

interface FileProps {
  filename: string;
  path: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class File extends AggregateRoot<FileProps> {
  get fileId(): FileId {
    return FileId.create(this._id).getValue();
  }
  get filename(): string {
    return this.props.filename;
  }
  get path(): string {
    return this.props.path;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: FileProps, id?: UniqueEntityID): Result<File> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.filename, argumentName: 'filename' },
      { argument: props.path, argumentName: 'path' },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<File>(guardResult.getErrorValue());
    }

    const isNewFile = !!id === false;

    const values = {
      ...props,
      filename: props.filename,
      url: props.path,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    const file = new File(values, id);

    if (isNewFile) {
      file.addDomainEvent(new FileCreated(file));
    }

    return Result.ok<File>(file);
  }
}
