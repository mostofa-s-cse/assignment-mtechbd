import { Controller, Post, Body, Get, Param, Put, Delete, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './orders.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.createOrder(createOrderDto);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number) {
    return await this.orderService.getOrderById(id);
  }

  @Get('customer/:phone')
  async getCustomer(@Param('phone') phone: string) {
    return await this.orderService.getCustomer(phone);;
  }

  @Get()
  async getAllOrders() {
    return await this.orderService.getAllOrders();
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: number) {
    return await this.orderService.deleteOrder(id);
  }
}
