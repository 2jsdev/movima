import { Role } from "../../../domain/role";

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  role: Role;
}
