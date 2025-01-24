import { Module } from '@nestjs/common';
import { RedisModule } from 'src/modules/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { PromotionsController } from './promotions.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [AuthModule,RedisModule],
  controllers: [PromotionsController],
  providers: [PromotionsService],
  exports: [PromotionsService], 
})
export class PromotionsModule {}
