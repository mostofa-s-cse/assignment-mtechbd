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
  ) {}

  async createProduct(dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...dto, 
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: product.id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'CREATE',
          context: 'Product Service - createProduct',
          description: `Product "${product.name}" created`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 201,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating a product',
        errorStack: error,
        context: 'ProductsService - createProduct',
      });
    }
  }

  async getAllProducts() {
    try {
      const products = await this.prisma.product.findMany();

      return {
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving products',
        errorStack: error,
        context: 'ProductsService - getAllProducts',
      });
    }
  }

  async getProductById(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

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
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving a product',
        errorStack: error,
        context: 'ProductsService - getProductById',
      });
    }
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          ...dto, 
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'UPDATE',
          context: 'Product Service - updateProduct',
          description: `Product "${product.name}" updated`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 200,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating a product',
        errorStack: error,
        context: 'ProductsService - updateProduct',
      });
    }
  }

  async deleteProduct(id: number) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });

      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PRODUCT_MANAGEMENT',
          action: 'DELETE',
          context: 'Product Service - deleteProduct',
          description: `Product "${product.name}" deleted`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 200,
        message: 'Product deleted successfully',
        data: product,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting a product',
        errorStack: error,
        context: 'ProductsService - deleteProduct',
      });
    }
  }
}
