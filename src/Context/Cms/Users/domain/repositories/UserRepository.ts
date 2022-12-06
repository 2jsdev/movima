import { User } from '../User';
import { UserName } from '../UserName';
import { UserEmail } from '../UserEmail';
import { VerificationToken } from '../VerificationToken';
import { Nullable } from '../../../../Shared/core/Nullable';

type searchProps = {
  user_email?: string;
  username?: string;
  activation_token?: string;
  reset_password_token?: string;
};

export interface UserRepository {
  search(props: searchProps): Promise<Nullable<User>>;
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
