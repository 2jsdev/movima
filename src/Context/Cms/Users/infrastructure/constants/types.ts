const TYPES = {
  // Services
  AuthService: Symbol.for('AuthService'),
  RedisClient: Symbol.for('RedisClient'),
  // Use cases
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  DeleteUserUseCase: Symbol.for('DeleteUserUseCase'),
  GetUserByUserIdUseCase: Symbol.for('GetUserByUserIdUseCase'),
  LoginUserUseCase: Symbol.for('LoginUserUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  RefreshAccessTokenUseCase: Symbol.for('RefreshAccessTokenUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),

  Middleware: Symbol.for('Middleware'),
};

export { TYPES };
