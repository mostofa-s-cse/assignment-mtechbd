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
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PromotionType } from '@prisma/client'; 

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
  @IsEnum(PromotionType)
  type: PromotionType; 

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
  discountValue?: number;

  @ValidateIf((o) => o.type === PromotionType.WEIGHTED)
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PromotionSlabDto)
  PromotionSlabs?: PromotionSlabDto[];

  @IsArray()
  @IsNumber({}, { each: true })
  products: number[];
}

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PromotionType) 
  type?: PromotionType; 

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
  discountValue?: number;

  @ValidateIf((o) => o.type === PromotionType.WEIGHTED)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionSlabDto)
  PromotionSlabs?: PromotionSlabDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  products?: number[];
}