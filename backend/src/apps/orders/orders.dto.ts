import { IsNotEmpty, IsString, IsEmail, IsOptional, ValidateNested, ArrayNotEmpty, IsArray, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string; 

  @IsOptional()
  @IsEmail()
  email?: string;  

  @IsOptional()
  @IsString()
  address?: string;
}

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

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