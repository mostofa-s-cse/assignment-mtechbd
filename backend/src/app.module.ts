import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apps/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SharedModule } from './modules/shared.module';
import { ProductsModule } from './apps/products/products.module';
import { PromotionsModule } from './apps/promotions/promotions.module';
import { OrderModule } from './apps/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    SharedModule,
    ProductsModule,
    PromotionsModule,
    OrderModule
  ],
})
export class AppModule {}
