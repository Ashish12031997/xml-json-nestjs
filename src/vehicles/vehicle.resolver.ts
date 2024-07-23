import { Resolver, Query } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle } from './schemas/vehicles.schema';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Query(returns => String)
  async fetchVehicles(): Promise<string> {
    await this.vehicleService.fetchAndStoreVehicles();
    return 'Vehicles data has been fetched and stored';
  }

  @Query(returns => [Vehicle])
  async getVehicles(): Promise<Vehicle[]> {
    return this.vehicleService.getAllVehicles();
  }
}
