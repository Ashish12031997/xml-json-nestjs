import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GraphqlModule } from '../graphql/graphql.module'
import { HealthCheckModule } from '../health-check/health-check.module'
import { AppController } from '../app/app.controller'
import { AppService } from '../app/app.service'

@Module({
  imports: [
    HealthCheckModule,
    MongooseModule.forRoot('mongodb://localhost:27017/development'),
    GraphqlModule,
  ],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
