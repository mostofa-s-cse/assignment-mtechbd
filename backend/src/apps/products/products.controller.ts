import { Controller, Post, Get, Put, Delete, Body, Param, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './products.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) { }

  /**
   * Creates a new product.
   * @param dto - Data Transfer Object for creating a product.
   * @param res - Express response object.
   * @returns The created product or an error response.
   */
  @Post()
  async create(@Body() dto: CreateProductDto, @Res() res: Response) {
    const result = await this.productsService.createProduct(dto);
    return res.status(result.status).json(result);
  }

  /**
   * Retrieves all products.
   * @param res - Express response object.
   * @returns A list of products or an error response.
   */
  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.productsService.getAllProducts();
    return res.status(result.status).json(result);
  }

  /**
   * Retrieves a product by its ID.
   * @param id - The ID of the product to retrieve.
   * @param res - Express response object.
   * @returns The product or an error response.
   */
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.productsService.getProductById(+id);
    return res.status(result.status).json(result);
  }

  /**
   * Updates a product by its ID.
   * @param id - The ID of the product to update.
   * @param dto - Data Transfer Object for updating a product.
   * @param res - Express response object.
   * @returns The updated product or an error response.
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @Res() res: Response,
  ) {
    const result = await this.productsService.updateProduct(+id, dto);
    return res.status(result.status).json(result);
  }

  /**
   * Deletes a product by its ID.
   * @param id - The ID of the product to delete.
   * @param res - Express response object.
   * @returns The deleted product or an error response.
   */
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    const result = await this.productsService.deleteProduct(+id);
    return res.status(result.status).json(result);
  }

  /**
   * Updates the status of a product.
   * @param id - The ID of the product to update.
   * @param isEnabled - The new status of the product.
   * @param res - Express response object.
   * @returns The updated product or an error response.
   */
  @Put(':id/isEnabled')
  async updateProductStatus(
    @Param('id') id: number,
    @Body('isEnabled') isEnabled: boolean,
    @Res() res: Response,
  ) {
    const result = await this.productsService.updateProductStatus(+id, isEnabled);
    return res.status(result.status).json(result);
  }
}