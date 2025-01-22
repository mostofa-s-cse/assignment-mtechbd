import { IsNotEmpty, IsString, IsNumber, IsEmail, IsOptional, ValidateNested, ArrayNotEmpty, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsOptional() 
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  totalDiscount?: number;

  @IsOptional() 
  @IsNumber()
  grandTotal?: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsNumber()
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  totalDiscount?: number;

  @IsOptional()
  @IsNumber()
  grandTotal?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items?: OrderItemDto[];
}