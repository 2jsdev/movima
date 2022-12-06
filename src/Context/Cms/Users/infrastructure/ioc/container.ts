import { Container } from 'inversify';

// Services
import { RedisAuthService } from '../services/redis/redisAuthService';

// Use cases
import { CreateUserUseCase } from '../../application/useCases/createUser/CreateUserUseCase';
import { DeleteUserUseCase } from '../../application/useCases/deleteUser/DeleteUserUseCase';
import { GetUserByUserIdUseCase } from '../../application/useCases/getUserByUserId/GetUserByUserIdUseCase';
import { LoginUserUseCase } from '../../application/useCases/login/LoginUseCase';
import { LogoutUseCase } from '../../application/useCases/logout/LogoutUseCase';
import { RefreshAccessTokenUseCase } from '../../application/useCases/refreshAccessToken/RefreshAccessTokenUseCase';
import { UpdateUserUseCase } from '../../application/useCases/updateUser/UpdateUserUseCase';
import { ActivateAccountUseCase } from '../../application/useCases/activateAccount/ActivateAccountUseCase';
import { ResendActivationLinkUseCase } from '../../application/useCases/resendActivationLink/ResendActivationLinkUseCase';
import { ResetPasswordLinkUseCase } from '../../application/useCases/resetPasswordLink/ResetPasswordLinkUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/resetPassword/ResetPasswordUseCase';

// Repositories
import { SequelizeUserRepository } from '../persistence/sequelize/SequelizeUserRepository';

// Types
import { TYPES } from '../constants/types';

const container = new Container();

// Services
container.bind(TYPES.AuthService).to(RedisAuthService).inSingletonScope();

// Use cases
container.bind<CreateUserUseCase>(TYPES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<DeleteUserUseCase>(TYPES.DeleteUserUseCase).to(DeleteUserUseCase);
container.bind<GetUserByUserIdUseCase>(TYPES.GetUserByUserIdUseCase).to(GetUserByUserIdUseCase);
container.bind<LoginUserUseCase>(TYPES.LoginUserUseCase).to(LoginUserUseCase);
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase);
container.bind<RefreshAccessTokenUseCase>(TYPES.RefreshAccessTokenUseCase).to(RefreshAccessTokenUseCase);
container.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
container.bind<ActivateAccountUseCase>(TYPES.ActivateAccountUseCase).to(ActivateAccountUseCase);
container.bind<ResendActivationLinkUseCase>(TYPES.ResendActivationLinkUseCase).to(ResendActivationLinkUseCase);
container.bind<ResetPasswordLinkUseCase>(TYPES.ResetPasswordLinkUseCase).to(ResetPasswordLinkUseCase);
container.bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);

// Repositories
container.bind(TYPES.UserRepository).to(SequelizeUserRepository).inSingletonScope();

export { container };
