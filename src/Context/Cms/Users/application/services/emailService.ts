import { User } from '../../domain/User';

export interface EmailService {
  sendAccountActivationEmail(user: User): Promise<void>;
  resendActivationLink(user: User): Promise<void>;
  sendResetPasswordLinkEmail(user: User): Promise<void>;
}
