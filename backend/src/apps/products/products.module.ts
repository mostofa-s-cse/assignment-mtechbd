import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { RedisModule } from 'src/modules/redis/redis.module'; 
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule,RedisModule], 
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}