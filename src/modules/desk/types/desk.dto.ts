import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateDeskInput {
  @IsNumber()
  @Type(() => Number)
  number: number;

  @IsNumber()
  @Type(() => Number)
  floor: number;
}

export class UpdateDeskInput {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  number?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  floor?: number;
}
