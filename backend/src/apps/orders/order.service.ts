import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateOrderDto, UpdateOrderDto } from './orders.dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) { }

/**
 * Calculates discounts for order items based on active promotions.
 * @param items - Array of order items.
 * @param promotions - Array of active promotions.
 * @returns An object containing subtotal, total discount, and grand total.
 */
async calculateDiscounts(items: CreateOrderDto['items'], promotions: any[]) {
  let subtotal = 0;
  let totalDiscount = 0;

  for (const item of items) {
    const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) continue;

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    for (const promotion of promotions) {
      if (promotion.type === 'percentage') {
        // Percentage discount
        totalDiscount += itemTotal * (promotion.discountPercentage / 100);
      } else if (promotion.type === 'fixed') {
        // Fixed discount
        totalDiscount += promotion.discountAmount * item.quantity;
      } else if (promotion.type === 'weighted') {
        // Weighted discount
        const totalWeight = product.weight * item.quantity; // Total weight in the same unit as slabs (e.g., kg)
        const slab = promotion.PromotionSlabs.find(
          (s) => totalWeight >= s.minWeight && totalWeight <= s.maxWeight,
        );
        if (slab) {
          // Calculate discount based on the total weight and discount per unit
          totalDiscount += slab.discountPerUnit * totalWeight;
        }
      }
    }
  }

  return { subtotal, totalDiscount, grandTotal: subtotal - totalDiscount };
}

/**
 * Creates a new order.
 * @param dto - Data Transfer Object for creating an order.
 * @returns The created order or an error response.
 */
async createOrder(dto: CreateOrderDto) {
  try {
    const { items, ...orderData } = dto;

    // Fetch active promotions
    const now = new Date();
    const promotions = await this.prisma.promotion.findMany({
      where: {
        isEnabled: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: { PromotionSlabs: true },
    });

    // Calculate discounts
    const { subtotal, totalDiscount, grandTotal } = await this.calculateDiscounts(items, promotions);

    // Create the order
    const createdOrder = await this.prisma.order.create({
      data: {
        ...orderData,
        subtotal,
        totalDiscount,
        grandTotal,
        OrderItems: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            weight: item.weight,
            discount: item.discount,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: { OrderItems: true },
    });

    // Log the action of creating an order
    await this.actionLogger.logAction(
      {
        referenceId: createdOrder.id,
        refereceType: 'ORDER_MANAGEMENT',
        action: 'CREATE',
        context: 'Order Service - createOrder',
        description: `Order created successfully`,
        additionalInfo: null,
      },
      null, // user ID, if applicable
    );

    return {
      status: 201,
      message: 'Order created successfully',
      data: createdOrder,
    };
  } catch (error) {
    // Log the error and return an error response
    return await this.errorLogger.errorlogger({
      errorMessage: 'An error occurred while creating an order',
      errorStack: error,
      context: 'OrderService - createOrder',
    });
  }
}

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order to retrieve.
   * @returns The order or an error response.
   */
  async getOrderById(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { OrderItems: true },
      });

      if (!order) {
        return {
          status: 404,
          message: 'Order not found',
        };
      }

      return {
        status: 200,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving an order',
        errorStack: error,
        context: 'OrderService - getOrderById',
      });
    }
  }

  /**
   * Retrieves all orders.
   * @returns A list of orders or an error response.
   */
  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: { OrderItems: true },
      });

      return {
        status: 200,
        message: 'Orders retrieved successfully',
        data: orders,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving orders',
        errorStack: error,
        context: 'OrderService - getAllOrders',
      });
    }
  }

  /**
   * Updates an order by its ID.
   * @param id - The ID of the order to update.
   * @param dto - Data Transfer Object for updating an order.
   * @returns The updated order or an error response.
   */
  async updateOrder(id: number, dto: UpdateOrderDto) {
    try {
      const existingOrder = await this.prisma.order.findUnique({ where: { id } });
      if (!existingOrder) {
        return {
          status: 404,
          message: 'Order not found',
        };
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: dto,
      });

      // Log the action of updating an order
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'UPDATE',
          context: 'Order Service - updateOrder',
          description: `Order updated successfully`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Order updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating an order',
        errorStack: error,
        context: 'OrderService - updateOrder',
      });
    }
  }

  /**
   * Deletes an order by its ID.
   * @param id - The ID of the order to delete.
   * @returns A success message or an error response.
   */
  async deleteOrder(id: number) {
    try {
      const existingOrder = await this.prisma.order.findUnique({ where: { id } });
      if (!existingOrder) {
        return {
          status: 404,
          message: 'Order not found',
        };
      }

      await this.prisma.order.delete({ where: { id } });

      // Log the action of deleting an order
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'ORDER_MANAGEMENT',
          action: 'DELETE',
          context: 'Order Service - deleteOrder',
          description: `Order deleted successfully`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting an order',
        errorStack: error,
        context: 'OrderService - deleteOrder',
      });
    }
  }
}