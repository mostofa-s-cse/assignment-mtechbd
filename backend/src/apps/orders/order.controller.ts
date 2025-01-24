import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orders.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Creates a new order.
   * @param createOrderDto - Data Transfer Object for creating an order.
   * @returns The created order or an error response.
   */
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto); 
  }

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order to retrieve.
   * @returns The order or an error response.
   */
  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return await this.orderService.getOrderById(id); 
  }

  /**
   * Retrieves a customer by their phone number.
   * @param phone - The phone number of the customer.
   * @returns The customer information or an error response.
   */
  @Get('customer/:phone')
  async getCustomer(@Param('phone') phone: string) {
    return await this.orderService.getCustomer(phone);
  }

  /**
   * Retrieves all orders.
   * @returns A list of orders or an error response.
   */
  @Get()
  async getAllOrders() {
    return await this.orderService.getAllOrders(); 
  }
}
