import { User } from '../User';
import { UserEmail } from '../UserEmail';
import { Nullable } from '../../../../Shared/core/Nullable';

type searchProps = {
  user_email?: string;
  username?: string;
  activation_token?: string;
  reset_password_token?: string;
};

export interface UserRepository {
  findOne(props: searchProps): Promise<Nullable<User>>;
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
