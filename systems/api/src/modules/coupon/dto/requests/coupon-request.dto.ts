import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';

import { DiscountType } from '../../constants/discount-type.constants';
import { AfterDate } from './validate/AfterDate';
import { BeforeDate } from './validate/BeforeDate';

export class CouponRequestDto {
  @IsString()
  id!: string;

  @IsBoolean()
  active!: boolean;

  @IsString()
  product!: string;

  @IsString()
  code!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Validate(BeforeDate, ['endDate'])
  @Type(() => Date)
  startDate!: Date;

  @Validate(AfterDate, [{ minDate: new Date() }])
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @IsNumber()
  @Min(0)
  @ValidateIf(o =>
    [DiscountType.Amount, DiscountType.EffectAmount].includes(o.discountType),
  )
  amountOff!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ValidateIf(o =>
    [DiscountType.EffectPercent, DiscountType.Percent].includes(o.discountType),
  )
  percentOff!: number;

  @IsString()
  @ValidateIf(o =>
    [DiscountType.EffectPercent, DiscountType.EffectAmount].includes(
      o.discountType,
    ),
  )
  effect!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
