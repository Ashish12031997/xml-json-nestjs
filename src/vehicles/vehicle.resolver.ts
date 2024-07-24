import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle,VehicleInformation } from './schemas/vehicles.schema';

/**
 * Resolver for the Vehicle entity.
 */
@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehiclesService) {}

  /**
   * Fetches and stores the vehicles data.
   * @returns A string indicating that the vehicles data has been fetched and stored.
   */
  @Query(returns => String)
  async fetchVehicles(): Promise<string> {
    await this.vehicleService.fetchAndStoreVehicles();
    return 'Vehicles data has been fetched and stored';
  }

  /**
   * Retrieves a list of vehicles.
   * @param page - The page number (optional, default is 1).
   * @param limit - The maximum number of vehicles to retrieve (optional, default is 10).
   * @returns An array of Vehicle objects.
   */
  @Query(returns => [Vehicle])
  async getVehicles(
    @Args('page', { type: () => Int, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true }) limit: number = 10,
  ): Promise<Vehicle[]> {
    return this.vehicleService.getAllVehicles(page, limit);
  }

  @Query(returns =>VehicleInformation)
  /**
   * Retrieves the vehicle information for a given makeId.
   *
   * @param makeId - The ID of the make.
   * @returns A Promise that resolves to the vehicle information or null if not found.
   */
  async getVehicleInformation(@Args('makeId', { type: () => Int }) makeId: number): Promise<VehicleInformation| null> {
    return this.vehicleService.getVehicleInformation(makeId);
  }
}
