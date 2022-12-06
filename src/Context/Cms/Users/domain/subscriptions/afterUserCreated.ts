import { injectable } from 'inversify';
import { IHandle } from '../../../../Shared/domain/events/IHandle';
import { EmailService } from '../../application/services/emailService';
import { DomainEvents } from '../../../../Shared/domain/events/DomainEvents';
import { UserCreated } from '../events/userCreated';

@injectable()
export class AfterUserCreated implements IHandle<UserCreated> {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.setupSubscriptions();
    this.emailService = emailService;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name);
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event;

    try {
      await this.emailService.sendAccountActivationEmail(user);
      console.log(`[AfterUserCreated]: Successfully executed sendAccountActivationEmail use case AfterUserCreated`);
    } catch (error) {
      console.log(`[AfterUserCreated]: Failed to execute sendAccountActivationEmail use case AfterUserCreated.`);
    }
  }
}
