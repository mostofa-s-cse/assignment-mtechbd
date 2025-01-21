import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators';
import { RedisService } from 'src/modules/redis/redis.service';
import { Decoder } from 'utils/decoder';
import { Jwt } from 'utils/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisRepository: RedisService,
    private decoder: Decoder,
    private jwt: Jwt,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.headers['authorization']?.split(' ')[1];
    const refreshToken = request.headers['x-refresh-token'];

    if (!token || !refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const jwtToken = await this.redisRepository.get('USER-AUTH-TOKEN', token);
      const jwtRefreshToken = await this.redisRepository.get(
        'USER-REFRESH-TOKEN',
        refreshToken,
      );

      const decoded = await this.decoder.decodeToken(jwtToken);
      const decodedRefresh = await this.decoder.decodeToken(jwtRefreshToken);

      if (!decoded.isValid) {
        throw new UnauthorizedException();
      }

      if (!decodedRefresh.isValid) {
        const { refreshTokenId } = await this.jwt.signRefreshToken(
          decoded.decoded,
        );
        response.setHeader('x-refresh-token', refreshTokenId);
      }

      request.user = decoded.decoded;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
