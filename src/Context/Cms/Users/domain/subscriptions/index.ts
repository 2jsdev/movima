import mailgunService from '../../infrastructure/services/mailgun/mailgunService';
import { AfterUserCreated } from './afterUserCreated';

new AfterUserCreated(mailgunService);
