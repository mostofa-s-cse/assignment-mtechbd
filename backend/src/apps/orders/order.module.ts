import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { RedisModule } from 'src/modules/redis/redis.module';


@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule { }
