import { JwtService } from '@nestjs/jwt';
import { uuid10 } from './uuid';
import { ConfigService } from '@nestjs/config';
import { ONE_DAY } from 'src/lib/constants/durations';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class Jwt {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private redisRepository: RedisService,
  ) {}
  async signToken(user: any) {
    const data = {
      ...user,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: ONE_DAY,
      secret: this.config.get('JWT_SECRET'),
    });

    const tokenId = uuid10();

    await this.redisRepository.setWithExpiry(
      'USER-AUTH-TOKEN',
      tokenId,
      token,
      ONE_DAY,
    );

    return {
      token,
      tokenId,
    };
  }

  async signRefreshToken(user: any) {
    const data = {
      ...user,
    };

    const refreshToken = await this.jwt.signAsync(data, {
      expiresIn: ONE_DAY / 2,
      secret: this.config.get('JWT_SECRET'),
    });

    const refreshTokenId = uuid10();

    await this.redisRepository.setWithExpiry(
      'USER-REFRESH-TOKEN',
      refreshTokenId,
      refreshToken,
      ONE_DAY / 2,
    );

    return {
      refreshToken,
      refreshTokenId,
    };
  }

  async generateToken(prefix: string, data: any, expiry: number) {
    const jwtOfData = await this.jwt.signAsync(data, {
      expiresIn: expiry,
      secret: this.config.get('JWT_SECRET'),
    });

    const tokenId = uuid10();

    await this.redisRepository.setWithExpiry(
      prefix,
      tokenId,
      jwtOfData,
      expiry,
    );

    return {
      tokenId,
    };
  }
}
