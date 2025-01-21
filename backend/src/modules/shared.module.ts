// shared.module.ts
import { Global, Module } from '@nestjs/common';
import { Decoder } from 'utils/decoder';
import { ErrorLogger } from 'utils/error-logger';
import { ActionLogger } from 'utils/action-logger';
import { Jwt } from 'utils/jwt';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';
import { Environment } from 'utils/env';

@Global()
@Module({
  imports: [RedisModule],
  providers: [Environment, JwtService, Jwt, Decoder, ErrorLogger, ActionLogger], // Provide your shared class
  exports: [Environment, JwtService, Jwt, Decoder, ErrorLogger, ActionLogger], // Export the shared class to make it available in other modules
})
export class SharedModule {}
