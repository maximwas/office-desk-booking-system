import { Type } from 'class-transformer';
import { IsDate, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBookingInput {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId;

  @IsMongoId()
  @Type(() => Types.ObjectId)
  deskId: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}

export class UpdateBookingInput {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  userId: Types.ObjectId;

  @IsMongoId()
  @Type(() => Types.ObjectId)
  deskId: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
