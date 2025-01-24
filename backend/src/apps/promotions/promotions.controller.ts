import { Controller, Post, Body, Get, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './promotions.dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @Get()
  async getAllPromotions() {
    return await this.promotionsService.getAllPromotions();
  }

  @Get(':id')
  async getPromotionById(@Param('id') id: number) {
    return await this.promotionsService.getPromotionById(id);
  }

  @Put(':id')
  async updatePromotion(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPromotionDto: CreatePromotionDto,
  ) {
    return await this.promotionsService.updatePromotion(id, createPromotionDto);
  }

  
  @Delete(':id')
  async deletePromotion(@Param('id') id: number) {
    return await this.promotionsService.deletePromotion(id);
  }
}
