import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { PromotionController } from './promotions.controller';
import { PromotionService } from './promotions.service';
import { RedisModule } from 'src/modules/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,RedisModule],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService], 
})
export class PromotionsModule {}
