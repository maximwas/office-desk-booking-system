import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BOOKING_SCHEMA_NAME, DESK_SCHEMA_NAME } from 'src/core/constants';

export type DeskDocument = HydratedDocument<Desk>;

@Schema({ collection: DESK_SCHEMA_NAME, timestamps: true })
export class Desk {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: Number, required: true, unique: true })
  number: number;

  @Prop({ type: Number, required: true })
  floor: number;

  @Prop({ type: Boolean, default: true })
  available: boolean;

  @Prop({ type: [Types.ObjectId], default: [], ref: BOOKING_SCHEMA_NAME })
  bookings: Types.ObjectId[];
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
