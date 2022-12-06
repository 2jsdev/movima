import { Guard } from '../../../Shared/core/Guard';
import { Result } from '../../../Shared/core/Result';
import { ValueObject } from '../../../Shared/domain/ValueObject';

interface UserNameProps {
  value: string;
}

export class UserName extends ValueObject<UserNameProps> {
  public static maxLength: number = 15;
  public static minLength: number = 2;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserNameProps) {
    super(props);
  }

  public static create(props: UserNameProps): Result<UserName> {
    const usernameResult = Guard.againstNullOrUndefined(props.value, 'username');
    if (usernameResult.isFailure) {
      return Result.fail<UserName>(usernameResult.getErrorValue());
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, props.value);
    if (minLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.getErrorValue());
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, props.value);
    if (maxLengthResult.isFailure) {
      return Result.fail<UserName>(minLengthResult.getErrorValue());
    }

    return Result.ok<UserName>(new UserName(props));
  }
}
