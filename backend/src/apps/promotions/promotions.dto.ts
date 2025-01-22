import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class PromotionSlabDto {
  @IsNotEmpty()
  @IsNumber()
  minWeight: number;

  @IsNotEmpty()
  @IsNumber()
  maxWeight: number;

  @IsNotEmpty()
  @IsNumber()
  discountPerUnit: number;
}

export class CreatePromotionDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string; // "percentage" | "fixed" | "weighted"

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  discountValue?: number; // Use discountValue instead of discountPercentage

  @ValidateIf((o) => o.type === 'weighted')
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PromotionSlabDto)
  PromotionSlabs?: PromotionSlabDto[]; // Required for weighted promotions
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  discountValue?: number; // Use discountValue instead of discountPercentage

  @ValidateIf((o) => o.type === 'weighted')
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionSlabDto)
  PromotionSlabs?: PromotionSlabDto[]; // For weighted promotions
}