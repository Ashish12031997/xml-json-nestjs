import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Document } from 'mongoose'

export type VehicleDocument = Vehicle & Document

/**
 * Represents a vehicle.
 */
@Schema()
@ObjectType()
export class Vehicle {
  /**
   * The unique identifier of the vehicle's make.
   */
  @Prop({ unique: true })
  @Field()
  makeId?: number

  /**
   * The name of the vehicle's make.
   */
  @Prop()
  @Field()
  makeName?: string
}

/**
 * Represents vehicle information.
 */
@Schema()
@ObjectType()
export class VehicleInformation {
  /**
   * The ID of the vehicle make.
   */
  @Prop()
  @Field()
  makeId?: number

  /**
   * The type of the vehicle make.
   */
  @Prop()
  @Field()
  makeType?: number

  /**
   * The name of the vehicle make.
   */
  @Prop()
  @Field()
  makeTypeName?: string
}

export const VehicleInformationSchema =
  SchemaFactory.createForClass(VehicleInformation)
export const VehicleSchema = SchemaFactory.createForClass(Vehicle)
