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
  ) {}

  /**
   * Calculates the discount for each order item based on active promotions.
   * @param items - The list of items in the order.
   * @returns The subtotal, total discount, and grand total after applying discounts.
   */
  private async calculateDiscounts(items: CreateOrderDto['items']) {
    let subtotal = 0;
    let totalDiscount = 0;
    const currentDate = new Date();

    for (const item of items) {
      // Fetch product details from the database
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

      // Apply applicable discounts based on promotion type
      for (const promotion of promotions) {
        if (promotion.type === 'PERCENTAGE') {
          totalDiscount += itemTotal * (promotion.discountValue / 100);
        } else if (promotion.type === 'FIXED') {
          totalDiscount += promotion.discountValue * item.quantity;
        } else if (promotion.type === 'WEIGHTED' && promotion.promotionSlabs.length > 0) {
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

  /**
   * Creates a new order and calculates its discount.
   * @param dto - The data required to create the order.
   * @returns The created order or an error response.
   */
  async createOrder(dto: CreateOrderDto) {
    try {
      const { items, customer } = dto;

      // Ensure the customer exists or create a new one
      const existingCustomer = await this.prisma.customer.upsert({
        where: { phone: customer.phone },
        update: { name: customer.name, phone: customer.phone, address: customer.address },
        create: customer,
      });

      // Calculate discounts and totals for the order
      const { subtotal, totalDiscount, grandTotal } = await this.calculateDiscounts(items);

      // Create the order in the database
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

      // Log the action
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

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order to retrieve.
   * @returns The order or an error response.
   */
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

  /**
   * Retrieves a customer by their phone number.
   * @param phone - The phone number of the customer.
   * @returns The customer or an error response.
   */
  async getCustomer(phone: string) {
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

  /**
   * Retrieves all orders in the system.
   * @returns A list of orders or an error response.
   */
  async getAllOrders() {
    const orders = await this.prisma.order.findMany({
      include: { orderItems: true },
    });
    return { status: 200, message: 'Orders retrieved successfully', data: orders };
  }
}
