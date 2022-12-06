import { Role } from './../../../domain/role';
export interface UpdateUserDTO {
  id: string;
  email?: string;
  username?: string;
  role: Role;
  isDeleted?: boolean;
}
