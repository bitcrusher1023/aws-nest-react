import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

type GenerateTrackingIdPayload = {
  coupon: { code: string };
  customer: { id: string };
  order: { id: string };
};

@Injectable()
export class TrackingService {
  constructor(private config: ConfigService) {}

  generateTrackingIds({ coupon, customer, order }: GenerateTrackingIdPayload) {
    const trackingIdSecrets = this.config.get<string[]>('secret.trackingID')!;

    return trackingIdSecrets.map(secretKey =>
      createHmac('SHA256', secretKey)
        .update(`${customer.id}/${order.id}/${coupon.code}`)
        .digest('hex'),
    );
  }

  isTrackingIdMatch({
    coupon,
    customer,
    order,
    trackingId,
  }: GenerateTrackingIdPayload & { trackingId: string }) {
    return (
      this.generateTrackingIds({ coupon, customer, order })?.find(
        id => id === trackingId,
      ) !== undefined
    );
  }
}
