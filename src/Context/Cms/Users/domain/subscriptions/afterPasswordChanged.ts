import { injectable } from 'inversify';
import { IHandle } from '../../../../Shared/domain/events/IHandle';
import { DomainEvents } from '../../../../Shared/domain/events/DomainEvents';
import { PasswordChanged } from '../events/passwordChanged';
import { AuthService } from '../../application/services/authService';
import { container } from '../../infrastructure/ioc/container';
import { TYPES } from '../../infrastructure/constants/types';

@injectable()
export class AfterPasswordChanged implements IHandle<PasswordChanged> {
  private authService: AuthService;

  constructor() {
    this.setupSubscriptions();
    this.authService = container.get<AuthService>(TYPES.AuthService);
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onPasswordChanged.bind(this), PasswordChanged.name);
  }

  private async onPasswordChanged(event: PasswordChanged): Promise<void> {
    const { user } = event;

    try {
      await this.authService.deAuthenticateUser(user.username.value.toString());
      console.log(`[afterPasswordChanged]: Successfully executed deAuthenticateUser afterPasswordChanged`);
    } catch (error) {
      console.log(`[afterPasswordChanged]: Failed to execute deAuthenticateUser afterPasswordChanged.`);
    }
  }
}
