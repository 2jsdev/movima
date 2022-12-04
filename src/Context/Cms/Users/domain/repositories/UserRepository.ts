import { User } from '../User';
import { UserName } from '../UserName';
import { UserEmail } from '../UserEmail';

export interface UserRepository {
  theEmailIsTaken(userEmail: UserEmail | string): Promise<boolean>;
  theUserNameIsTaken(userName: UserName | string): Promise<boolean>;
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: UserName | string): Promise<User>;
  getUserByActivationToken(activationToken: string): Promise<User>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  
}
