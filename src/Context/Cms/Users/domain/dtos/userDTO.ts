import { Role } from '../role';

export interface UserDTO {
  id?: string;
  username: string;
  isEmailVerified?: boolean;
  role?: Role;
  isDeleted?: boolean;
}
