import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RedisService } from 'src/modules/redis/redis.service';
import { ActionLogger } from 'utils/action-logger';
import { Decoder } from 'utils/decoder';
import { Environment } from 'utils/env';
import { ErrorLogger } from 'utils/error-logger';
import { Jwt } from 'utils/jwt';
import { AuthDto } from './auth.dto';
import * as argon from 'argon2';
import { Users } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: Jwt,
    private redis: RedisService,
    private env: Environment,
    private decoder: Decoder,
    private errorlogger: ErrorLogger,
    private actionlogger: ActionLogger,
  ) {}

  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.users.findFirst({
        where: {
          OR: [
            {
              email: dto.identifier,
            },
            {
              phone: dto.identifier,
            },
          ],
        },
        include: {
          roleInfo: true,
        },
      });

      if (!user) {
        return {
          status: 404,
          message: 'User not found with provided credentials',
        };
      }

      const match = await argon.verify(user.password, dto.password);

      if (!match) {
        return {
          status: 403,
          message: 'Your password is incorrect',
        };
      }

      if (user.isPasswordResetRequired) {
        return {
          status: 403,
          message: 'Password reset required',
          data: {
            isPasswordResetRequired: user.isPasswordResetRequired,
          },
        };
      }

      const passwordExpireDate = user.lastPasswordResetDate.getDate() + 90;
      const currentDate = new Date().getDate();

      if (currentDate > passwordExpireDate) {
        await this.prisma.users.update({
          where: {
            id: user.id,
          },
          data: {
            isPasswordResetRequired: true,
          },
        });
        return {
          status: 403,
          message: 'Password expired, please reset password',
        };
      }

      delete user.password;

      const { tokenId } = await this.jwt.signToken(user);

      const { refreshTokenId } = await this.jwt.signRefreshToken(user);

      await this.actionlogger.logAction(
        {
          referenceId: null,
          refereceType: 'AUTH_MANAGEMENT',
          action: 'LOGIN',
          context: 'Auth Service - login',
          description: `${user.name} logged in`,
          additionalInfo: null,
        },
        user.id,
      );

      return {
        status: 200,
        message: 'Login successful',
        data: {
          user,
          tokenId,
          refreshTokenId,
        },
      };
    } catch (error) {
      return await this.errorlogger.errorlogger({
        errorMessage: 'An error occurred while logging in',
        errorStack: error,
        context: 'AuthService - login',
      });
    }
  }

  async logout(token, refreshToken, issuer: Users) {
    try {
      await this.redis.delete('USER-AUTH-TOKEN', token);
      await this.redis.delete('USER-REFRESH-TOKEN', refreshToken);

      await this.actionlogger.logAction(
        {
          referenceId: null,
          refereceType: 'AUTH_MANAGEMENT',
          action: 'LOGOUT',
          context: 'Auth Service - logout',
          description: `${issuer.name} logged out`,
          additionalInfo: null,
        },
        issuer.id,
      );

      return {
        status: 200,
        message: 'Logout successful',
      };
    } catch (error) {
      return await this.errorlogger.errorlogger({
        errorMessage: 'An error occurred while logging out',
        errorStack: error,
        context: 'AuthService - logout',
      });
    }
  }
}
