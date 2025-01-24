import { NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./orders.dto";
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) { }

  private async calculateDiscounts(items: CreateOrderDto['items']) {
    let subtotal = 0;
    let totalDiscount = 0;
    const currentDate = new Date();

    for (const item of items) {
      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      // Get all active promotions for the product
      const promotions = await this.prisma.promotion.findMany({
        where: {
          products: {
            some: {
              id: product.id,
            },
          },
          isEnabled: true,
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        include: { promotionSlabs: true },
      });

      for (const promotion of promotions) {
        // Apply percentage discounts
        if (promotion.type === 'PERCENTAGE') {
          totalDiscount += itemTotal * (promotion.discountValue / 100);
        }
        // Apply fixed discounts
        else if (promotion.type === 'FIXED') {
          totalDiscount += promotion.discountValue * item.quantity;
        }
        // Apply weighted discounts
        else if (promotion.type === 'WEIGHTED' && promotion.promotionSlabs.length > 0) {
          const totalWeightInKg = product.weight * item.quantity;
          const slab = promotion.promotionSlabs.find(
            (s) => totalWeightInKg >= s.minWeight && totalWeightInKg <= s.maxWeight,
          );
          if (slab) {
            const applicableUnits = Math.floor(totalWeightInKg / 0.5);
            totalDiscount += slab.discountPerUnit * applicableUnits;
          }
        }
      }
    }

    return { subtotal, totalDiscount, grandTotal: subtotal - totalDiscount };
  }

  async createOrder(dto: CreateOrderDto) {
    try {
      const { items, customer } = dto;

      const existingCustomer = await this.prisma.customer.upsert({
        where: { phone: customer.phone },
        update: { name: customer.name, phone: customer.phone, address: customer.address },
        create: customer,
      });

      const { subtotal, totalDiscount, grandTotal } = await this.calculateDiscounts(items);

      const createdOrder = await this.prisma.order.create({
        data: {
          subtotal,
          totalDiscount,
          grandTotal,
          customerId: existingCustomer.id,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              weight: item.weight || 0,
              discount: item.discount || 0,
              totalPrice: item.totalPrice || 0,
            })),
          },
        },
        include: { orderItems: true },
      });

      await this.actionLogger.logAction(
        {
          referenceId: createdOrder.id,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'CREATE',
          context: 'OrderService - createOrder',
          description: 'Order created successfully',
          additionalInfo: createdOrder,
        },
        null,
      );

      return { status: 201, message: 'Order created successfully', data: createdOrder };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error creating order',
        errorStack: error,
        context: 'OrderService - createOrder',
      });
    }
  }

  async getOrderById(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });
    if (!order) {
      return {
        status: 404,
        message: "Order not found"
      };
    }
    return { status: 200, message: 'Order retrieved successfully', data: order };
  }


  async getCustomer(phone: string) {
    console.log('phone', phone);

    const customer = await this.prisma.customer.findUnique({
      where: { phone },
      select: {
        id: true,
        phone: true,
        email: true,
        address: true,
      },
    });

    if (!customer) {
      return {
        status: 404,
        message: "Customer not found",
      };
    }
    return { status: 200, message: 'Customer retrieved successfully', data: customer };
  }



  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: { orderItems: true },
    });
    return { status: 200, message: 'Customer retrieved successfully', data: orders };
  }

  async deleteOrder(id: number) {
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return {
        status: 404,
        message: "Order not found"
      };
    }

    await this.prisma.order.delete({ where: { id } });

    await this.actionLogger.logAction(
      {
        referenceId: id,
        refereceType: 'ORDER_MANAGEMENT',
        action: 'DELETE',
        context: 'OrderService - deleteOrder',
        description: 'Order deleted successfully',
        additionalInfo: { deletedOrderId: id },
      },
      null,
    );

    return { status: 200, message: 'Order deleted successfully' };
  }
}
