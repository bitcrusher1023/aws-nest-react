import { Exclude, Expose } from 'class-transformer';

import { BaseAPIResponse } from './base-api-response.dto';

@Exclude()
export class PaginateInfo {
  @Expose()
  limit!: number;

  @Expose()
  skip!: number;

  @Expose()
  total!: number;
}

export interface PaginateObject<T> {
  items: T[];
}

export abstract class MultiItemApiResponseDto<
  TransformedData,
> extends BaseAPIResponse<TransformedData, PaginateInfo> {}
