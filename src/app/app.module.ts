import { Module } from '@nestjs/common';
import { HealthCheckModule } from '../health-check/health-check.module'; // Import the health module
import { AppController } from '../app/app.controller';
import { AppService } from '../app/app.service';

@Module({
  imports: [HealthCheckModule], // Add HealthModule to imports
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
