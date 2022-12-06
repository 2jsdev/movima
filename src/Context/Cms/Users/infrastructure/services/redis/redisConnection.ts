import redis from 'redis';
import { Redis } from 'redis';
import config from '../../config';

const port = config.get('redis.redisServerPort');
const host = config.get('redis.redisServerURL');

const redisConnection: Redis =
  config.get('env') === 'production'
    ? redis.createClient(config.get('redis.redisConnectionString'))
    : redis.createClient(port, host); // creates a new client

redisConnection.on('connect', () => {
  console.log(`[REDIS]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
