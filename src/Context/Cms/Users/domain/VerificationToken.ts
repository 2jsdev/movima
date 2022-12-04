import { Result } from '../../../Shared/core/Result';
import { ValueObject } from '../../../Shared/domain/ValueObject';

interface IVerificationToken {
  value: string;
}

export class VerificationToken extends ValueObject<IVerificationToken> {
  private static numberDigits = 4;
  private static tokenExpiryHours = 6;

  get value(): string {
    return this.props.value;
  }

  public isCodeValid(code: string): boolean {
    return this.value.toUpperCase() === code.toUpperCase();
  }

  private constructor(props: IVerificationToken) {
    super(props);
  }

  public static create(rawToken?: string): Result<VerificationToken> {
    if (rawToken) {
      return Result.ok<VerificationToken>(new VerificationToken({ value: rawToken }));
    }

    //create random 4 character token
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let token = '';

    for (let i = this.numberDigits; i > 0; --i) {
      token += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    token = token.toUpperCase();

    // create expiration date
    const expires = new Date();
    expires.setHours(expires.getHours() + this.tokenExpiryHours);

    return Result.ok<VerificationToken>(new VerificationToken({ value: token }));
  }
}
