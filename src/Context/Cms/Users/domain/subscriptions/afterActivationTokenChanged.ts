import { injectable } from 'inversify';
import { IHandle } from '../../../../Shared/domain/events/IHandle';
import { EmailService } from '../../application/services/emailService';
import { DomainEvents } from '../../../../Shared/domain/events/DomainEvents';
import { ActivationTokenChanged } from '../events/activationTokenChanged';

@injectable()
export class AfterActivationTokenChanged implements IHandle<ActivationTokenChanged> {
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    this.setupSubscriptions();
    this.emailService = emailService;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onActivationTokenChanged.bind(this), ActivationTokenChanged.name);
  }

  private async onActivationTokenChanged(event: ActivationTokenChanged): Promise<void> {
    const { user } = event;

    try {
      await this.emailService.resendActivationLink(user);
      console.log(
        `[AfterActivationTokenChanged]: Successfully executed resendActivationLink use case AfterActivationTokenChanged`,
      );
    } catch (error) {
      console.log(
        `[AfterActivationTokenChanged]: Failed to execute resendActivationLink use case AfterActivationTokenChanged.`,
      );
    }
  }
}
