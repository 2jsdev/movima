import { UserId } from './UserId';
import { UserName } from './UserName';
import { UserEmail } from './UserEmail';
import { UserPassword } from './UserPassword';
import { VerificationToken } from './VerificationToken';
import { JWTToken, RefreshToken } from './Jwt';
import { Role } from './role';

import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../Shared/domain/UniqueEntityID';

import { Guard } from '../../../Shared/core/Guard';
import { Result } from './../../../Shared/core/Result';

import { UserCreated } from './events/userCreated';
import { UserLoggedIn } from './events/userLoggedIn';
import { UserDeleted } from './events/userDeleted';
import { EmailVerified } from './events/emailVerified';
import { PasswordResetTokenSent } from './events/passwordResetTokenSent';
import { ActivationTokenChanged } from './events/activationTokenChanged';

interface UserProps {
  email: UserEmail;
  username: UserName;
  password?: UserPassword;
  isEmailVerified?: boolean;
  role?: Role;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  isDeleted?: boolean;
  lastLogin?: Date;

  activationToken?: VerificationToken;
  activationTokenSentAt?: Date;
  activatedAt?: Date;

  resetPasswordToken?: VerificationToken;
  resetPasswordTokenSentAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get username(): UserName {
    return this.props.username;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get accessToken(): string {
    return this.props.accessToken;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get role(): Role {
    return this.props.role;
  }

  get lastLogin(): Date {
    return this.props.lastLogin;
  }

  get refreshToken(): RefreshToken {
    return this.props.refreshToken;
  }

  get activationToken(): VerificationToken {
    return this.props.activationToken;
  }
  get activationTokenSentAt(): Date {
    return this.props.activationTokenSentAt;
  }
  get activatedAt(): Date {
    return this.props.activatedAt;
  }

  get resetPasswordToken(): VerificationToken {
    return this.props.resetPasswordToken;
  }
  get resetPasswordTokenSentAt(): Date {
    return this.props.resetPasswordTokenSentAt;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.addDomainEvent(new UserLoggedIn(this));
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();
  }

  public delete(): void {
    if (!this.props.isDeleted) {
      this.addDomainEvent(new UserDeleted(this));
      this.props.isDeleted = true;
    }
  }

  public verifyEmail(): void {
    this.addDomainEvent(new EmailVerified(this));

    this.props.isEmailVerified = true;
    this.props.activatedAt = new Date();

    this.props.activationToken = null;
    this.props.resetPasswordToken = null;
  }

  public setActivationToken(): void {
    this.addDomainEvent(new ActivationTokenChanged(this));

    this.props.activationToken = VerificationToken.create().getValue();
    this.props.activationTokenSentAt = new Date();
  }

  public setResetPasswordToken(token: VerificationToken): void {
    this.addDomainEvent(new PasswordResetTokenSent(this));
    
    this.props.resetPasswordToken = token;
    this.props.resetPasswordTokenSentAt = new Date();
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.username, argumentName: 'username' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
        isDeleted: props.isDeleted || false,
        isEmailVerified: props.isEmailVerified || false,
        role: props.role ? props.role : 'USER',
      },
      id,
    );

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
      user.setActivationToken();
    }

    return Result.ok<User>(user);
  }
}
