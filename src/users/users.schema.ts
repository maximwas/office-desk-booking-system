import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_SCHEMA_NAME } from 'src/constants';

export type UsersDocument = HydratedDocument<Users>;

@Schema({ collection: USER_SCHEMA_NAME, timestamps: true })
export class Users {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
