import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { RedisModule } from 'src/modules/redis/redis.module'; 

@Module({
  imports: [PrismaModule, RedisModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}