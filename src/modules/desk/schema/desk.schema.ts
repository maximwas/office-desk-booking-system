import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DESK_SCHEMA_NAME } from 'src/core/constants';
import { Booking, BookingSchema } from 'src/modules/booking/schema/booking.schema';

export type DeskDocument = HydratedDocument<Desk>;

@Schema({ collection: DESK_SCHEMA_NAME, timestamps: true })
export class Desk {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true, unique: true })
  number: number;

  @Prop({ type: Number, required: true, unique: true })
  roomNumber: number;

  @Prop({ type: Boolean, default: true })
  available: boolean;

  @Prop({ type: BookingSchema })
  bookings?: Booking[];
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
