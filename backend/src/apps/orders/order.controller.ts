import { Controller, Post, Get, Put, Delete, Body, Param, Res } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './orders.dto';
import { Response } from 'express';
import { OrderService } from './order.service';

@Controller('orders') 
export class OrderController {
  constructor(private orderService: OrderService) { } 

  /**
   * Creates a new order.
   * @param dto - Data Transfer Object for creating an order.
   * @param res - Express response object.
   * @returns The created order or an error response.
   */
  @Post()
  async create(@Body() dto: CreateOrderDto, @Res() res: Response) {
    const result = await this.orderService.createOrder(dto); 
    return res.status(result.status).json(result); 
  }

  /**
   * Retrieves all orders.
   * @param res - Express response object.
   * @returns A list of orders or an error response.
   */
  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.orderService.getAllOrders();
    return res.status(result.status).json(result); 
  }

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order to retrieve.
   * @param res - Express response object.
   * @returns The order or an error response.
   */
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.orderService.getOrderById(+id);
    return res.status(result.status).json(result); 
  }

  /**
   * Updates an existing order.
   * @param id - The ID of the order to update.
   * @param dto - Data Transfer Object for updating an order.
   * @param res - Express response object.
   * @returns The updated order or an error response.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    const result = await this.orderService.updateOrder(+id, dto); 
    return res.status(result.status).json(result); 
  }

  /**
   * Deletes an order by its ID.
   * @param id - The ID of the order to delete.
   * @param res - Express response object.
   * @returns A success message or an error response.
   */
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    const result = await this.orderService.deleteOrder(+id); 
    return res.status(result.status).json(result); 
  }
}