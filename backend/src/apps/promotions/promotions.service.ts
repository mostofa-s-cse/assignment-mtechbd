import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreatePromotionDto, UpdatePromotionDto } from './promotions.dto';
import { PromotionType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  async createPromotion(dto: CreatePromotionDto) {
    try {
      const { PromotionSlabs, products, ...promotionData } = dto;
  
      // Validate that the products exist
      const existingProducts = await this.prisma.product.findMany({
        where: { id: { in: products } },
      });
  
      const missingProducts = products.filter(
        (id) => !existingProducts.some((product) => product.id === id),
      );
  
      if (missingProducts.length > 0) {
        return {
          status: 400,
          message: `The following product IDs do not exist: ${missingProducts.join(', ')}`,
        };
      }
  
      const createdPromotion = await this.prisma.promotion.create({
        data: {
          ...promotionData,
          type: dto.type as PromotionType,
          discountValue: dto.discountValue,
          promotionSlabs: PromotionSlabs
            ? {
                create: PromotionSlabs,
              }
            : undefined,
          products: {
            connect: products.map((id) => ({ id })),
          },
        },
        include: { promotionSlabs: true, products: true },
      });
  
      await this.actionLogger.logAction(
        {
          referenceId: createdPromotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'CREATE',
          context: 'Promotion Service - createPromotion',
          description: `Promotion "${createdPromotion.title}" created`,
          additionalInfo: null,
        },
        null,
      );
  
      return {
        status: 201,
        message: 'Promotion created successfully',
        data: createdPromotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating a promotion',
        errorStack: error,
        context: 'PromotionService - createPromotion',
      });
    }
  }
  

  async getAllPromotions() {
    try {
      const promotions = await this.prisma.promotion.findMany({
        include: { promotionSlabs: true, products: true },
      });

      return {
        status: 200,
        message: 'Promotions retrieved successfully',
        data: promotions,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving promotions',
        errorStack: error,
        context: 'PromotionService - getAllPromotions',
      });
    }
  }

 
  async getPromotionById(id: number) {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
        include: { promotionSlabs: true, products: true },
      });

      if (!promotion) {
        return {
          status: 404,
          message: 'Promotion not found',
        };
      }

      return {
        status: 200,
        message: 'Promotion retrieved successfully',
        data: promotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving a promotion',
        errorStack: error,
        context: 'PromotionService - getPromotionById',
      });
    }
  }

  async updatePromotion(id: number, dto: UpdatePromotionDto) {
    try {
      const { PromotionSlabs, products, ...promotionData } = dto;
  
      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { id },
        include: { products: true, promotionSlabs: true },
      });
  
      if (!existingPromotion) {
        return {
          status: 404,
          message: `Promotion with ID ${id} not found`,
        };
      }
  
      const existingProducts = await this.prisma.product.findMany({
        where: { id: { in: products } },
      });
  
      const missingProducts = products.filter(
        (id) => !existingProducts.some((product) => product.id === id),
      );
  
      if (missingProducts.length > 0) {
        return {
          status: 400,
          message: `The following product IDs do not exist: ${missingProducts.join(', ')}`,
        };
      }
  
      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: {
          ...promotionData,
          type: dto.type as PromotionType,
          discountValue: dto.discountValue,
          promotionSlabs: PromotionSlabs
            ? {
                deleteMany: {}, 
                create: PromotionSlabs, 
              }
            : undefined,
          products: {
            set: products.map((id) => ({ id })),
          },
        },
        include: { promotionSlabs: true, products: true },
      });
  
      await this.actionLogger.logAction(
        {
          referenceId: updatedPromotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'UPDATE',
          context: 'Promotion Service - updatePromotion',
          description: `Promotion "${updatedPromotion.title}" updated`,
          additionalInfo: null,
        },
        null,
      );
  
      return {
        status: 200,
        message: 'Promotion updated successfully',
        data: updatedPromotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating the promotion',
        errorStack: error,
        context: 'PromotionService - updatePromotion',
      });
    }
  }
  
  

  async deletePromotion(id: number) {
    try {
      const promotion = await this.prisma.promotion.delete({
        where: { id },
        include: { promotionSlabs: true, products: true },
      });

      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'DELETE',
          context: 'Promotion Service - deletePromotion',
          description: `Promotion "${promotion.title}" deleted`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 200,
        message: 'Promotion deleted successfully',
        data: promotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting a promotion',
        errorStack: error,
        context: 'PromotionService - deletePromotion',
      });
    }
  }
}