import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Decoder {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async decodeToken(token: string) {
    try {
      const decoded = await this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      return {
        isValid: true,
        decoded,
      };
    } catch (error) {
      return {
        isValid: false,
        error,
      };
    }
  }
}
