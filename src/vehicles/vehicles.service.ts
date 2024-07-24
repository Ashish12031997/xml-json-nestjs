import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { parseString } from 'xml2js'
import {
  Vehicle,
  VehicleInformation,
  VehicleDocument,
} from './schemas/vehicles.schema'
import { HttpService } from '@nestjs/axios'

/**
 * Service class for handling vehicles-related operations.
 */
@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  /**
   * Constructs a new instance of the VehiclesService class.
   * @param httpService The HttpService instance for making HTTP requests.
   * @param vehicleModel The Mongoose Model for the Vehicle collection.
   * @param vehicleInformation The Mongoose Model for the VehicleInformation collection.
   */
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<Vehicle>,
    @InjectModel(VehicleInformation.name)
    private vehicleInformation: Model<VehicleInformation>
  ) {}

  /**
   * Fetches vehicle make information from an external API and stores it in the database.
   */
  async fetchAndStoreVehicles(): Promise<void> {
    try {
      let vehicleMakeIds: number[] = [];

      const { data } = (await this.httpService
        .get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML')
        .toPromise()) as { data: any };

      const parsedData = await this.parseXML(data);
      const vehicles = parsedData.Response.Results[0].AllVehicleMakes;
      this.logger.log("All vehicle make information fetched successfully");

      const bulkOperations = vehicles.map((vehicle: any) => ({
        updateOne: {
          filter: { makeId: vehicle.Make_ID[0] },
          update: {
            makeId: vehicle.Make_ID[0],
            makeName: vehicle.Make_Name[0],
          },
          upsert: true,
        },
      }));

      await this.vehicleModel.bulkWrite(bulkOperations);
      this.logger.log("Vehicle make information stored successfully");

      let vehicleInfo: any[] = [];
      for (const id of vehicleMakeIds) {
        let vehicalDataUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${id}?format=xml`;
        const { data } = (await this.httpService
          .get(vehicalDataUrl)
          .toPromise()) as { data: any };

        const parsedVehicleInfo = await this.parseXML(data);
        const vehicleTypes = parsedVehicleInfo.Response.Results.flatMap(
          (vehicleInfo: any) => vehicleInfo.VehicleTypesForMakeIds || []
        );

        vehicleTypes.forEach(async (vehicleType: any) => {
          //  we will be storing vehicle information in chunks of 100 records
          if (vehicleInfo && vehicleInfo.length % 100 == 0) {
            await this.vehicleInformation.bulkWrite(vehicleInfo);
            vehicleInfo = [];
            this.logger.log(`Vehicle information stored successfully for ${vehicleInfo.length} records`);
          }

          vehicleInfo.push({
            insertOne: {
              document: {
                makeType: vehicleType.VehicleTypeId[0],
                makeTypeName: vehicleType.VehicleTypeName[0],
                makeId: id,
              },
            },
          });
        });

        await this.vehicleInformation.bulkWrite(vehicleInfo);
        this.logger.log(`All Vehicle information stored successfully`);
      }
    } catch (error: any) {
      this.logger.error(`Error fetching and storing vehicle data: ${error.message}`);
    }
  }

  /**
   * Retrieves a paginated list of vehicles.
   * @param page The page number.
   * @param limit The maximum number of vehicles per page.
   * @returns A Promise that resolves to an array of Vehicle objects.
   */
  async getAllVehicles(page: number, limit: number): Promise<Vehicle[]> {
    const skip = (page - 1) * limit;
    return await this.vehicleModel.find().skip(skip).limit(limit).exec();
  }

  /**
   * Parses an XML string and returns the parsed data.
   * @param xml The XML string to parse.
   * @returns A Promise that resolves to the parsed data.
   */
  private async parseXML(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
