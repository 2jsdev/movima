const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  EmailService: Symbol.for('EmailService'),
  // Use cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  GetUserByUserIdUseCase: Symbol.for('GetUserByUserIdUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  RefreshAccessTokenUseCase: Symbol.for('RefreshAccessTokenUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),
  ResendActivationLinkUseCase: Symbol.for('ResendActivationLinkUseCase'),

  ActivateAccountUseCase: Symbol.for('ActivateAccountUseCase'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),

  // Subscriptions
  AfterUserCreated: Symbol.for('AfterUserCreated'),
};

export { TYPES };
