import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateProductDto, UpdateProductDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) { }

  /**
   * Creates a new product.
   * @param dto - Data Transfer Object for creating a product.
   * @returns The created product or an error response.
   */
  async createProduct(dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({ data: dto });

      // Log the action of creating a product
      await this.actionLogger.logAction(
        {
          referenceId: product.id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'CREATE',
          context: 'Product Service - createProduct',
          description: `Product "${product.name}" created`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 201,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating a product',
        errorStack: error,
        context: 'ProductsService - createProduct',
      });
    }
  }

  /**
   * Retrieves all products.
   * @returns A list of products or an error response.
   */
  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany();

      return {
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving products',
        errorStack: error,
        context: 'ProductsService - getAllProducts',
      });
    }
  }

  /**
   * Retrieves a product by its ID.
   * @param id - The ID of the product to retrieve.
   * @returns The product or an error response.
   */
  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });

      if (!product) {
        return {
          status: 404,
          message: 'Product not found',
        };
      }

      return {
        status: 200,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving a product',
        errorStack: error,
        context: 'ProductsService - getProductById',
      });
    }
  }

  /**
   * Updates a product by its ID.
   * @param id - The ID of the product to update.
   * @param dto - Data Transfer Object for updating a product.
   * @returns The updated product or an error response.
   */
  async updateProduct(id: number, dto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: dto,
      });

      // Log the action of updating a product
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'UPDATE',
          context: 'Product Service - updateProduct',
          description: `Product "${product.name}" updated`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating a product',
        errorStack: error,
        context: 'ProductsService - updateProduct',
      });
    }
  }

  /**
   * Deletes a product by its ID.
   * @param id - The ID of the product to delete.
   * @returns The deleted product or an error response.
   */
  async deleteProduct(id: number) {
    try {
      const product = await this.prisma.product.delete({ where: { id } });

      // Log the action of deleting a product
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'DELETE',
          context: 'Product Service - deleteProduct',
          description: `Product "${product.name}" deleted`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Product deleted successfully',
        data: product,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting a product',
        errorStack: error,
        context: 'ProductsService - deleteProduct',
      });
    }
  }

  /**
   * Checks if a product is enabled (active).
   * @param id - The ID of the product to check.
   * @returns A boolean indicating whether the product is enabled or an error response.
   */
  async updateProductStatus(id: number, isEnabled: boolean) {
    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { isEnabled },
      });

      // Log the action of updating product status
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'UPDATE_STATUS',
          context: 'Product Service - updateProductStatus',
          description: `Product status updated to "${isEnabled ? 'enabled' : 'disabled'}"`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Product status updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating product status',
        errorStack: error,
        context: 'ProductsService - updateProductStatus',
      });
    }
  }
}