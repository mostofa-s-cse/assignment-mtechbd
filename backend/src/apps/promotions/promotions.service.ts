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

  /**
   * Creates a new promotion.
   * @param dto - The data to create a new promotion.
   * @returns The created promotion or an error response.
   */
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

      // Check if any product is already assigned to another promotion
      const assignedProducts = await this.prisma.product.findMany({
        where: {
          id: { in: products },
          promotions: { some: {} }, // Checks if the product is already associated with any promotion
        },
        include: { promotions: true },
      });

      if (assignedProducts.length > 0) {
        const alreadyAssignedProductIds = assignedProducts.map((product) => product.id);
        return {
          status: 400,
          message: `The following products are already assigned to another promotion: ${alreadyAssignedProductIds.join(', ')}`,
        };
      }

      // Create the promotion
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

      // Log the action
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

  /**
   * Retrieves all promotions.
   * @returns A list of promotions or an error response.
   */
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

  /**
   * Retrieves a promotion by its ID.
   * @param id - The ID of the promotion to retrieve.
   * @returns The promotion or an error response.
   */
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

  /**
   * Updates the status of a promotion.
   * @param id - The ID of the promotion to update.
   * @param isEnabled - The status to set for the promotion (enabled or disabled).
   * @returns The updated promotion or an error response.
   */
  async updatePromotionStatus(id: number, isEnabled: boolean) {
    try {
      const updatedPromotion = await this.prisma.promotion.update({
        where: { id },
        data: { isEnabled },
      });

      await this.actionLogger.logAction(
        {
          referenceId: id,
          refereceType: 'PROMOTION_MANAGEMENT',
          action: 'UPDATE_STATUS',
          context: 'Promotion Service - updatePromotionStatus',
          description: `Promotion status updated to "${isEnabled ? 'enabled' : 'disabled'}"`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 200,
        message: 'Promotion status updated successfully',
        data: updatedPromotion,
      };
    } catch (error) {
      return await this.errorLogger.errorlogger({
        errorMessage: 'An error occurred while updating promotion status',
        errorStack: error,
        context: 'PromotionService - updatePromotionStatus',
      });
    }
  }

  /**
   * Updates an existing promotion.
   * @param id - The ID of the promotion to update.
   * @param dto - The data to update the promotion with.
   * @returns The updated promotion or an error response.
   */
  async updatePromotion(id: number, dto: UpdatePromotionDto) {
    try {
      const { PromotionSlabs, products, ...promotionData } = dto;

      const updatedPromotion = await this.prisma.promotion.update({
        where: { id }, // Locate the promotion by its ID.
        data: {
          title: dto.title, // Update the title of the promotion.
          startDate: dto.startDate, // Update the start date of the promotion.
          endDate: dto.endDate, // Update the end date of the promotion.
        },
        include: { promotionSlabs: true, products: true }, // Include related slabs and products in the result.
      });
      

      // Log the action
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

  /**
   * Deletes a promotion by its ID.
   * @param id - The ID of the promotion to delete.
   * @returns The deleted promotion or an error response.
   */
  async deletePromotion(id: number) {
    try {
      const promotion = await this.prisma.promotion.delete({
        where: { id },
        include: { promotionSlabs: true, products: true },
      });

      await this.actionLogger.logAction(
        {
          referenceId: promotion.id,
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
        errorMessage: 'An error occurred while deleting the promotion',
        errorStack: error,
        context: 'PromotionService - deletePromotion',
      });
    }
  }
}
