import { Mapper } from '../../../../../Shared/infrastructure/Mapper';
import { User } from '../../../domain/User';
import { UserDTO } from '../../../domain/dtos/userDTO';
import { UniqueEntityID } from '../../../../../Shared/domain/UniqueEntityID';
import { UserEmail } from '../../../domain/UserEmail';
import { UserPassword } from '../../../domain/UserPassword';
import { UserName } from '../../../domain/UserName';

export class UserMapper implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      id: user.userId.id.toString(),
      username: user.username.value,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      isDeleted: user.isDeleted,
    };
  }

  public static toDomain(raw: any): User {
    const userNameOrError = UserName.create({ name: raw.username });
    const userPasswordOrError = UserPassword.create({ value: raw.user_password, hashed: true });
    const userEmailOrError = UserEmail.create(raw.user_email);

    const userOrError = User.create(
      {
        username: userNameOrError.getValue(),
        isDeleted: raw.is_deleted,
        role: raw.role,
        isEmailVerified: raw.is_email_verified,
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue(),
      },
      new UniqueEntityID(raw.user_id),
    );

    userOrError.isFailure ? console.log(userOrError.getErrorValue()) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    return {
      user_id: user.userId.id.toString(),
      user_email: user.email.value,
      is_email_verified: user.isEmailVerified,
      username: user.username.value,
      user_password: password,
      role: user.role,
      is_deleted: user.isDeleted,
    };
  }
}
