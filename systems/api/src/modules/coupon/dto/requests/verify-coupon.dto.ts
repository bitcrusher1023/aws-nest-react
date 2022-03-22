import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class VerifyingOrderItemRequest {
  @Min(0)
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsString()
  productId!: string;

  @Min(1)
  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class VerifyingOrderRequest {
  @IsString()
  id!: string;

  @Min(0)
  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsArray()
  @Type(() => VerifyingOrderItemRequest)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @ValidateNested()
  items!: VerifyingOrderItemRequest[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class VerifyingCustomerRequest {
  @IsString()
  id!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class VerifyCouponBodyDto {
  @IsDefined()
  @Type(() => VerifyingCustomerRequest)
  @ValidateNested()
  customer!: VerifyingCustomerRequest;

  @IsDefined()
  @Type(() => VerifyingOrderRequest)
  @ValidateNested()
  order!: VerifyingOrderRequest;

  @IsString()
  trackingId!: string;
}

export class ClientVerifyCouponBodyDto {
  @IsDefined()
  @Type(() => VerifyingCustomerRequest)
  @ValidateNested()
  customer!: VerifyingCustomerRequest;

  @IsDefined()
  @Type(() => VerifyingOrderRequest)
  @ValidateNested()
  order!: VerifyingOrderRequest;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class VerifyCouponParamsDto {
  @IsString()
  code!: string;
}
