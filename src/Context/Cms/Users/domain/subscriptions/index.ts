import { AfterUserCreated } from './afterUserCreated';
import { AfterActivationTokenChanged } from './afterActivationTokenChanged';
import mailgunService from '../../infrastructure/services/mailgun/mailgunService';

new AfterUserCreated(mailgunService);
new AfterActivationTokenChanged(mailgunService);
