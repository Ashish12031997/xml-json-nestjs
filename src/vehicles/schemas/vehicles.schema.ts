import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Document } from 'mongoose'

export type VehicleDocument = Vehicle & Document

@Schema()
@ObjectType()
export class Vehicle {
  @Field(() => ID)
  _id?: string;

  @Prop({ unique: true })
  @Field()
  makeId?: number

  @Prop()
  @Field()
  makeName?: string
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle)
