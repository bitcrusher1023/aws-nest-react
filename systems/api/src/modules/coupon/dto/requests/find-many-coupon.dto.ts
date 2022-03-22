import { PaginationDto } from '@api/dto/requests/pagination.dto';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';

export class FindManyCouponQueryDto extends PaginationDto {
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]), {
    toClassOnly: true,
  })
  @IsArray()
  @IsOptional()
  products?: string[];
}
