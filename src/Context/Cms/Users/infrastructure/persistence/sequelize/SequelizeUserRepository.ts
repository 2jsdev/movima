import { injectable } from 'inversify';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { User } from '../../../domain/User';
import { UserName } from './../../../domain/UserName';
import { UserEmail } from '../../../domain/UserEmail';
import { UserMapper } from './UserMapper';
import { Nullable } from '../../../../../Shared/core/Nullable';
import models from '../../../../../Shared/infrastructure/persistence/sequelize/models';

@injectable()
export class SequelizeUserRepository implements UserRepository {
  private models: any;

  constructor() {
    this.models = models;
  }
  async findOne(props: {
    user_email?: string;
    username?: string;
    activation_token?: string;
    reset_password_token?: string;
  }): Promise<Nullable<User>> {
    const UserModel = this.models.User;
    const user = await UserModel.findOne({
      where: props,
    });
    return UserMapper.toDomain(user) || null;
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
          individualHooks: true,
          hooks: true,
          where: { user_id: user.userId.id.toString() },
        });
      }
      return;
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
