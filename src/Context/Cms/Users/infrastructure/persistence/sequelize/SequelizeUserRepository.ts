import { injectable } from 'inversify';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/User';
import { UserName } from './../../../domain/UserName';
import { UserEmail } from '../../../domain/UserEmail';
import { UserMapper } from './UserMapper';
import models from '../../../../../Shared/infrastructure/persistence/sequelize/models';

@injectable()
export class SequelizeUserRepository implements UserRepository {
  private models: any;

  constructor() {
    this.models = models;
  }

  async theEmailIsTaken(userEmail: UserEmail | string): Promise<boolean> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        user_email: userEmail instanceof UserEmail ? (<UserEmail>userEmail).value : userEmail,
      },
    });
    return !!user === true;
  }

  async theUserNameIsTaken(userName: UserName | string): Promise<boolean> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        username: userName instanceof UserName ? (<UserName>userName).value : userName,
      },
    });
    return !!user === true;
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        user_email: userEmail.value,
      },
    });
    return !!user === true;
  }

  async getUserByUserName(userName: UserName | string): Promise<User> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        username: userName instanceof UserName ? (<UserName>userName).value : userName,
      },
    });
    if (!!user === false) throw new Error('User not found.');
    return UserMapper.toDomain(user);
  }

  async getUserByActivationToken(activationToken: string): Promise<User> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        activation_token: activationToken,
      },
    });
    if (!!user === false) throw new Error('User not found.');
    return UserMapper.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!!user === false) throw new Error('User not found.');
    return UserMapper.toDomain(user);
  }

  async save(user: User): Promise<void> {
    try {
      const UserModel = this.models.User;
      const exists = await this.exists(user.email);
      const raw = await UserMapper.toPersistence(user);

      if (!exists) {
        await UserModel.create(raw);
      }
      return;
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  async update(user: User): Promise<void> {
    try {
      const UserModel = this.models.User;
      const exists = await this.getUserByUserId(user.userId.id.toString());
      const raw = await UserMapper.toPersistence(user);

      if (exists) {
        await UserModel.update(raw, {
          where: { user_id: user.userId.id.toString() },
        });
      }
      return;
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
