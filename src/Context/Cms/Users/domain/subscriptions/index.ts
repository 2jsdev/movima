import mailgunService from '../../infrastructure/services/mailgun/mailgunService';
import { AfterUserCreated } from './afterUserCreated';
import { AfterActivationTokenChanged } from './afterActivationTokenChanged';
import { AfterPasswordResetTokenChanged } from './afterPasswordResetTokenChanged';
import { AfterPasswordChanged } from './afterPasswordChanged';

new AfterUserCreated(mailgunService);
new AfterActivationTokenChanged(mailgunService);
new AfterPasswordResetTokenChanged(mailgunService);
new AfterPasswordChanged();
