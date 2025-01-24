import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { RedisModule } from 'src/modules/redis/redis.module'; 
import { AuthModule } from '../auth/auth.module';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule,RedisModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}