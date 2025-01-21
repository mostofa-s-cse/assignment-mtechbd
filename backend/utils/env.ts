import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Environment {
  constructor(private env: ConfigService) {}

  isDevelopment() {
    return this.env.get('TARGET_ENV') === 'development';
  }

  isStaging() {
    return this.env.get('TARGET_ENV') === 'staging';
  }

  isProduction() {
    return this.env.get('TARGET_ENV') === 'production';
  }
}
