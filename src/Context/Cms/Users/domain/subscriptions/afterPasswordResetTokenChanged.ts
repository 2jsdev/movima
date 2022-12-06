import { injectable } from 'inversify';
import { IHandle } from '../../../../Shared/domain/events/IHandle';
import { EmailService } from '../../application/services/emailService';
import { DomainEvents } from '../../../../Shared/domain/events/DomainEvents';
import { PasswordResetTokenChanged } from '../events/passwordResetTokenChanged';

@injectable()
export class AfterPasswordResetTokenChanged implements IHandle<PasswordResetTokenChanged> {
  private emailService: EmailService

  constructor (emailService: EmailService) {
    this.setupSubscriptions();
    this.emailService = emailService;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onPasswordResetTokenChanged.bind(this), PasswordResetTokenChanged.name);
  }

  private async onPasswordResetTokenChanged(event: PasswordResetTokenChanged): Promise<void> {
    const { user } = event;

    try {
      await this.emailService.sendResetPasswordLinkEmail(user);
      console.log(`[AfterPasswordResetTokenChanged]: Successfully executed sendResetPasswordLinkEmail use case AfterPasswordResetTokenChanged`);
    } catch (error) {
      console.log(`[AfterPasswordResetTokenChanged]: Failed to execute sendResetPasswordLinkEmail use case AfterPasswordResetTokenChanged.`);
    }
  }
}
