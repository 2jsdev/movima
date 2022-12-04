import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  serverUrl: {
    doc: 'The application server url.',
    format: String,
    default: 'http://127.0.0.1:4000',
    env: 'SERVER_URL',
  },
  app: {
    name: {
      doc: 'Application name.',
      format: String,
      default: 'Acme',
      env: 'APPLICATION_NAME',
    },
    port: {
      doc: 'The application port.',
      format: Number,
      default: 4000,
      env: 'PORT',
    },
  },
  sequelize: {
    host: {
      doc: 'The database host',
      format: String,
      env: 'DATABASE_HOST',
      default: 'localhost',
    },
    dialect: {
      doc: 'The database dialect',
      format: String,
      env: 'DATABASE_DIALECT',
      default: 'postgres',
    },
    port: {
      doc: 'The database port',
      format: Number,
      env: 'DATABASE_PORT',
      default: 5432,
    },
    username: {
      doc: 'The database username',
      format: String,
      env: 'DATABASE_USER',
      default: 'username',
    },
    password: {
      doc: 'The database password',
      format: String,
      env: 'DATABASE_PASSWORD',
      default: 'password',
    },
    database: {
      doc: 'The database name',
      format: String,
      env: 'DATABASE_NAME',
      default: 'data',
    },
  },
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
