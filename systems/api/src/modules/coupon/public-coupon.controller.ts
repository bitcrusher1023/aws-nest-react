import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  ClientVerifyCouponBodyDto,
  VerifyCouponBodyDto,
  VerifyCouponParamsDto,
} from './dto/requests/verify-coupon.dto';
import { VerifyCouponResponseDto } from './dto/responses/verify-coupon-response.dto';
import { VerifyCouponService } from './services/verify-coupon.service';

@Controller()
@ApiTags('Coupon Public')
export class PublicCouponController {
  constructor(private verifyCouponService: VerifyCouponService) {}

  @Post('/client/v1/coupons/:code/validate')
  @HttpCode(200)
  async verifyCouponClient(
    @Param() params: VerifyCouponParamsDto,
    @Body() body: ClientVerifyCouponBodyDto,
  ): Promise<VerifyCouponResponseDto> {
    const verifiedResponse = await this.verifyCouponService.clientVerifyCoupon({
      ...params,
      ...body,
    });
    return new VerifyCouponResponseDto(verifiedResponse);
  }

  @Post('/v1/coupons/:code/validate')
  @HttpCode(200)
  async verifyCouponServer(
    @Param() params: VerifyCouponParamsDto,
    @Body() body: VerifyCouponBodyDto,
  ): Promise<VerifyCouponResponseDto> {
    const verifiedResponse = await this.verifyCouponService.verifyCoupon({
      ...params,
      ...body,
    });
    return new VerifyCouponResponseDto(verifiedResponse);
  }
}
