import { EmailService } from '../../../application/services/emailService';
import { User } from '../../../domain/User';
import mailgun from 'mailgun-js';
import config from '../../config';

class MailgunService implements EmailService {
  public async sendAccountActivationEmail(user: User): Promise<void> {
    try {
      const token = user.activationToken.value;
      // redirect to react app
      const accountActivationLink = config.get('appUrl') + '/account/activate?token=' + token;
      console.log('accountActivationLink', accountActivationLink);

      const mg = mailgun({
        apiKey: config.get('mail.apiKey'),
        domain: config.get('mail.domain'),
      });

      const data = {
        from: config.get('mail.senderEmailAddress'),
        to: config.get('env') === 'production' ? user.email : config.get('mail.senderEmailAddress'),
        subject: 'Account Activation',
        template: 'account_activation',
        'h:X-Mailgun-Variables': JSON.stringify({
          activation_link: accountActivationLink,
        }),
      };

      const body = await mg.messages().send(data);
      console.log('body', body);
    } catch (error) {
      console.log('error', error);
    }
  }
  public async resendActivationLink(user: User): Promise<void> {
    return this.sendAccountActivationEmail(user);
  }
  public async sendResetPasswordLinkEmail(user: User): Promise<void> {
    try {
      const token = user.resetPasswordToken.value;
      // Eg: http://localhost:4000/account/reset-password?token=e04ce280-1ca8-11ea-b82f-dbd64ede476e
      const resetPasswordLink = config.get('appUrl') + '/account/reset-password?token=' + token;
      console.log('resetPasswordLink', resetPasswordLink);

      // Next, send this link via mailgun to the user
      const mg = mailgun({
        apiKey: config.get('mail.apiKey'),
        domain: config.get('mail.domain'),
      });

      const data = {
        from: config.get('mail.senderEmailAddress'),
        to: process.env.NODE_ENV === 'production' ? user.email : config.get('mail.senderEmailAddress'),
        subject: 'Reset Password',
        template: 'reset_password_link',
        'h:X-Mailgun-Variables': JSON.stringify({
          reset_password_link: resetPasswordLink,
        }),
      };

      const body = await mg.messages().send(data);
      console.log('body', body);
    } catch (error) {
      console.log('error', error);
    }
  }
}

const mailgunService = new MailgunService();

export default new MailgunService()
