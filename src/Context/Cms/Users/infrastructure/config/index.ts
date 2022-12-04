import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  jwt: {
    secret: {
      doc: 'The app secret.',
      format: String,
      default: 'secret',
      env: 'APP_SECRET',
    },
    tokenExpiryTime: {
      doc: 'The token expiry time.',
      format: Number,
      default: 300000, // seconds => 5 minutes
      env: 'TOKEN_EXPIRY_TIME',
    },
  },
  redis: {
    redisServerPort: {
      doc: 'The redis server port.',
      format: String,
      default: '',
      env: 'REDIS_SERVER_PORT',
    },
    redisServerURL: {
      doc: 'The redis server url.',
      format: String,
      default: '',
      env: 'REDIS_SERVER_URL',
    },
    redisConnectionString: {
      doc: 'The redis connection string.',
      format: String,
      default: '',
      env: 'REDIS_CONNECTION_STRING',
    },
  },
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
