import { injectable } from 'inversify';
import { RedisClient } from 'redis';
import * as jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { AuthService } from './../../../application/services/authService';
import { User } from './../../../domain/User';
import { JWTClaims, JWTToken, RefreshToken } from '../../../domain/Jwt';

import config from '../../config';
import { redisConnection } from './redisConnection';

@injectable()
export class RedisAuthService implements AuthService {
  private tokenExpiryTime: number = 604800;
  public jwtHashName: string = 'activeJwtClients';

  protected client: RedisClient = redisConnection;

  public async refreshTokenExists(refreshToken: RefreshToken): Promise<boolean> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    return keys.length !== 0;
  }

  public async getUserNameFromRefreshToken(refreshToken: RefreshToken): Promise<string> {
    const keys = await this.getAllKeys(`*${refreshToken}*`);
    const exists = keys.length !== 0;

    if (!exists) throw new Error('Username not found for refresh token.');

    const key = keys[0];

    return key.substring(key.indexOf(this.jwtHashName) + this.jwtHashName.length + 1);
  }

  public async saveAuthenticatedUser(user: User): Promise<void> {
    if (user.isLoggedIn()) {
      await this.addToken(user.username.value, user.refreshToken, user.accessToken);
    }
  }

  public async deAuthenticateUser(username: string): Promise<void> {
    await this.clearAllSessions(username);
  }

  public createRefreshToken(): RefreshToken {
    return randtoken.uid(256) as RefreshToken;
  }

  public signJWT(props: JWTClaims): JWTToken {
    const claims: JWTClaims = {
      email: props.email,
      username: props.username,
      userId: props.userId,
      role: props.role,
      isEmailVerified: props.isEmailVerified,
    };

    return jwt.sign(claims, config.get('jwt.secret'), {
      expiresIn: config.get('jwt.tokenExpiryTime'),
    });
  }

  public decodeJWT(token: string): Promise<JWTClaims> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, config.get('jwt.secret'), (error, decoded) => {
        if (error) return resolve(null);
        return resolve(decoded);
      });
    });
  }

  private constructKey(username: string, refreshToken: RefreshToken): string {
    return `refresh-${refreshToken}.${this.jwtHashName}.${username}`;
  }

  public addToken(username: string, refreshToken: RefreshToken, token: JWTToken): Promise<any> {
    return this.set(this.constructKey(username, refreshToken), token);
  }

  public async clearAllTokens(): Promise<any> {
    const allKeys = await this.getAllKeys(`*${this.jwtHashName}*`);
    return Promise.all(allKeys.map((key) => this.deleteOne(key)));
  }

  public countSessions(username: string): Promise<number> {
    return this.count(`*${this.jwtHashName}.${username}`);
  }

  public countTokens(): Promise<number> {
    return this.count(`*${this.jwtHashName}*`);
  }

  public async getTokens(username: string): Promise<string[]> {
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${username}`);
    return keyValues.map((kv) => kv.value);
  }

  public async getToken(username: string, refreshToken: string): Promise<string> {
    return this.getOne(this.constructKey(username, refreshToken));
  }

  public async clearToken(username: string, refreshToken: string): Promise<any> {
    return this.deleteOne(this.constructKey(username, refreshToken));
  }

  public async clearAllSessions(username: string): Promise<any> {
    const keyValues = await this.getAllKeyValue(`*${this.jwtHashName}.${username}`);
    const keys = keyValues.map((kv) => kv.key);
    return Promise.all(keys.map((key) => this.deleteOne(key)));
  }

  public async sessionExists(username: string, refreshToken: string): Promise<boolean> {
    const token = await this.getToken(username, refreshToken);
    if (!!token) {
      return true;
    } else {
      return false;
    }
  }

  public async count(key: string): Promise<number> {
    const allKeys = await this.getAllKeys(key);
    return allKeys.length;
  }

  public exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      return this.count(key)
        .then((count) => {
          return resolve(count >= 1 ? true : false);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  public getOne<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error: Error, reply: unknown) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(<T>reply);
        }
      });
    });
  }

  public getAllKeys(wildcard: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.client.keys(wildcard, async (error: Error, results: string[]) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results);
        }
      });
    });
  }

  public getAllKeyValue(wildcard: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.client.keys(wildcard, async (error: Error, results: string[]) => {
        if (error) {
          return reject(error);
        } else {
          const allResults = await Promise.all(
            results.map(async (key) => {
              const value = await this.getOne(key);
              return { key, value };
            }),
          );
          return resolve(allResults);
        }
      });
    });
  }

  public set(key: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, (error, reply) => {
        if (error) {
          return reject(error);
        } else {
          this.client.expire(key, this.tokenExpiryTime);
          return resolve(reply);
        }
      });
    });
  }

  public deleteOne(key: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, reply) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(reply);
        }
      });
    });
  }

  public testConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.set('test', 'connected', (error) => {
        if (error) {
          reject();
        } else {
          resolve(true);
        }
      });
    });
  }
}
