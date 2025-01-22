import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { PromotionController } from './promotions.controller';
import { PromotionService } from './promotions.service';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionController],
  providers: [PromotionService],
  exports: [PromotionService], 
})
export class PromotionsModule {}
