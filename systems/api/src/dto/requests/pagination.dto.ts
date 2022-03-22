import { Transform } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @Min(0)
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  skip = 0;

  @Min(1)
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit = 20;
}
