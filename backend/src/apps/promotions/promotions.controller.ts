import { Controller, Post, Get, Put, Delete, Body, Param, Res, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto } from './promotions.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/guards';

@Controller('promotions')
@UseGuards(AuthGuard)
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  /**
   * Creates a new promotion.
   * @param dto - Data Transfer Object for creating a promotion.
   * @param res - Express response object.
   * @returns The created promotion or an error response.
   */
  @Post()
  async create(@Body() dto: CreatePromotionDto, @Res() res: Response) {
    const result = await this.promotionService.createPromotion(dto);
    return res.status(result.status).json(result);
  }

  /**
   * Retrieves all promotions.
   * @param res - Express response object.
   * @returns A list of promotions or an error response.
   */
  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.promotionService.getAllPromotions();
    return res.status(result.status).json(result);
  }

  /**
   * Retrieves a promotion by its ID.
   * @param id - The ID of the promotion to retrieve.
   * @param res - Express response object.
   * @returns The promotion or an error response.
   */
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.promotionService.getPromotionById(+id);
    return res.status(result.status).json(result);
  }

  /**
   * Updates a promotion by its ID.
   * @param id - The ID of the promotion to update.
   * @param dto - Data Transfer Object for updating a promotion.
   * @param res - Express response object.
   * @returns The updated promotion or an error response.
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdatePromotionDto, @Res() res: Response) {
    const result = await this.promotionService.updatePromotion(+id, dto);
    return res.status(result.status).json(result);
  }

  /**
   * Deletes a promotion by its ID.
   * @param id - The ID of the promotion to delete.
   * @param res - Express response object.
   * @returns A success message or an error response.
   */
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    const result = await this.promotionService.deletePromotion(+id);
    return res.status(result.status).json(result);
  }
}