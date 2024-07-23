import { Module } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { VehicleResolver } from './vehicle.resolver'
import { HttpModule } from '@nestjs/axios'
import { MongooseModule } from '@nestjs/mongoose'
import { Vehicle, VehicleSchema } from './schemas/vehicles.schema'

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
  providers: [VehiclesService, VehicleResolver],
})
export class VehiclesModule {}
