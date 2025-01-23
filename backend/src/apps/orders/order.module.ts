import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { RedisModule } from 'src/modules/redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, RedisModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }
