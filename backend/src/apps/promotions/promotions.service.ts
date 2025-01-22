import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreatePromotionDto, UpdatePromotionDto } from './promotions.dto';

@Injectable()
export class PromotionService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) { }

  /**
   * Creates a new promotion.
   * @param dto - Data Transfer Object for creating a promotion.
   * @returns The created promotion or an error response.
   */
  async createPromotion(dto: CreatePromotionDto) {
    try {
      const { PromotionSlabs, ...promotionData } = dto;

      const createdPromotion = await this.prisma.promotion.create({
        data: {
          ...promotionData,
          discountValue: dto.discountValue, // Ensure this is correctly mapped
          PromotionSlabs: PromotionSlabs
            ? {
              create: PromotionSlabs,
            }
            : undefined,
        },
        include: { PromotionSlabs: true },
      });

      // Log the action of creating a promotion
      await this.actionLogger.logAction(
        {
          referenceId: createdPromotion.id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'CREATE',
          context: 'Promotion Service - createPromotion',
          description: `Promotion "${createdPromotion.title}" created`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 201,
        message: 'Promotion created successfully',
        data: createdPromotion,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while creating a promotion',
        errorStack: error,
        context: 'PromotionService - createPromotion',
      });
    }
  }

  /**
   * Retrieves all promotions.
   * @returns A list of promotions or an error response.
   */
  async getAllPromotions() {
    try {
      const promotions = await this.prisma.promotion.findMany({
        include: { PromotionSlabs: true },
      });

      return {
        status: 200,
        message: 'Promotions retrieved successfully',
        data: promotions,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving promotions',
        errorStack: error,
        context: 'PromotionService - getAllPromotions',
      });
    }
  }

  /**
   * Retrieves a promotion by its ID.
   * @param id - The ID of the promotion to retrieve.
   * @returns The promotion or an error response.
   */
  async getPromotionById(id: number) {
    try {
      const promotion = await this.prisma.promotion.findUnique({
        where: { id },
        include: { PromotionSlabs: true },
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
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while retrieving a promotion',
        errorStack: error,
        context: 'PromotionService - getPromotionById',
      });
    }
  }

  /**
   * Updates a promotion by its ID.
   * @param id - The ID of the promotion to update.
   * @param dto - Data Transfer Object for updating a promotion.
   * @returns The updated promotion or an error response.
   */
  async updatePromotion(id: number, dto: UpdatePromotionDto) {
    try {
      const existingPromotion = await this.prisma.promotion.findUnique({ where: { id } });
      if (!existingPromotion) {
        return {
          status: 404,
          message: 'Promotion not found',
        };
      }

      const { PromotionSlabs, ...promotionData } = dto;

      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: {
          ...promotionData,
          PromotionSlabs: PromotionSlabs
            ? {
              deleteMany: {}, // Delete existing slabs
              create: PromotionSlabs, // Create new slabs
            }
            : undefined,
        },
        include: { PromotionSlabs: true },
      });

      // Log the action of updating a promotion
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'UPDATE',
          context: 'Promotion Service - updatePromotion',
          description: `Promotion "${updatedPromotion.title}" updated`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Promotion updated successfully',
        data: updatedPromotion,
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating a promotion',
        errorStack: error,
        context: 'PromotionService - updatePromotion',
      });
    }
  }

  /**
   * Deletes a promotion by its ID.
   * @param id - The ID of the promotion to delete.
   * @returns A success message or an error response.
   */
  async deletePromotion(id: number) {
    try {
      const existingPromotion = await this.prisma.promotion.findUnique({ where: { id } });
      if (!existingPromotion) {
        return {
          status: 404,
          message: 'Promotion not found',
        };
      }

      await this.prisma.promotion.delete({ where: { id } });

      // Log the action of deleting a promotion
      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'DELETE',
          context: 'Promotion Service - deletePromotion',
          description: `Promotion "${existingPromotion.title}" deleted`,
          additionalInfo: null,
        },
        null, // user ID, if applicable
      );

      return {
        status: 200,
        message: 'Promotion deleted successfully',
      };
    } catch (error) {
      // Log the error and return an error response
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while deleting a promotion',
        errorStack: error,
        context: 'PromotionService - deletePromotion',
      });
    }
  }
}