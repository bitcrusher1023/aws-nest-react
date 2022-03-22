import { PickType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { ActiveState } from '../../constants/active-state.constants';
import { CouponRequestDto } from './coupon-request.dto';

export class UpdateCouponActiveParamsDto extends PickType(CouponRequestDto, [
  'code',
] as const) {
  @IsString()
  @IsEnum(ActiveState)
  state!: ActiveState;
}
