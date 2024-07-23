import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { parseString } from 'xml2js'
import { Vehicle, VehicleDocument } from './schemas/vehicles.schema'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class VehiclesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<Vehicle>
  ) {}

  async fetchAndStoreVehicles(): Promise<void> {
    const { data } = (await this.httpService.get(
      'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML'
    ).toPromise()) as { data: any };
    
    const parsedData = await this.parseXML(data);
    const vehicles = parsedData.Response.Results[0].AllVehicleMakes;
    for (const vehicle of vehicles) {
        await this.vehicleModel.updateOne(
          { makeId: vehicle.Make_ID[0] },
          { makeId: vehicle.Make_ID[0], makeName: vehicle.Make_Name[0] },
          { upsert: true },
        );
      }
  }

  async getAllVehicles(): Promise<Vehicle[]> {
    return await this.vehicleModel.find().exec();
  }

  private async parseXML(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, (err: any, result: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}
