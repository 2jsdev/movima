import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  app: {
    url: {
      doc: 'Application url.',
      format: String,
      default: 'http://localhost:4000',
      env: 'APPLICATION_URL',
    },
  },
  aws: {
    accessKeyId: {
      doc: 'AWS: access key id.',
      format: String,
      default: '',
      env: 'AWS_ACCESS_KEY_ID',
    },
    secretAccessKey: {
      doc: 'AWS: secret access key.',
      format: String,
      default: '',
      env: 'AWS_SECRET_ACCESS_KEY',
    },
    s3: {
      bucketName: {
        doc: 'S3: bucket name.',
        format: String,
        default: '',
        env: 'AWS_S3_BUCKET',
      },
      defaultRegion: {
        doc: 'S3: default region.',
        format: String,
        default: '',
        env: 'AWS_DEFAULT_REGION',
      },
      defaultFilesACL: {
        doc: 'S3: default files ACL.',
        format: String,
        default: '',
        env: 'AWS_DEFAULT_FILES_ACL',
      },
    },
  },
});

config.loadFile([__dirname + '/default.json', __dirname + '/' + config.get('env') + '.json']);

export default config;
