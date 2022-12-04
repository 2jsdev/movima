import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  appUrl: {
    doc: 'Application url.',
    format: String,
    default: 'http://localhost:3000',
    env: 'APPLICATION_URL',
  },
  serverUrl: {
    doc: 'Server url.',
    format: String,
    default: 'http://localhost:4000',
    env: 'SERVER_URL',
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
  mail: {
    apiKey: {
      doc: 'Mailgun api key.',
      format: String,
      default: '',
      env: 'MAILGUN_API_KEY',
    },
    domain: {
      doc: 'Mailgun domain.',
      format: String,
      default: '',
      env: 'MAILGUN_DOMAIN',
    },
    senderName: {
      doc: 'Email sender name.',
      format: String,
      default: 'Support',
      env: 'SENDER_NAME',
    },
    senderEmailAddress: {
      doc: 'Sender email address.',
      format: String,
      default: 'support@acne.com',
      env: 'SENDER_EMAIL_ADDRESS',
    },
  },
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
