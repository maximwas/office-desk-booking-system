import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BOOKING_SCHEMA_NAME, USER_SCHEMA_NAME } from 'src/core/constants';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ collection: BOOKING_SCHEMA_NAME })
export class Booking {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: USER_SCHEMA_NAME, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startTime: Date;

  @Prop({ type: Date, required: true })
  endTime: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
