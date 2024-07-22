import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
    @Get('/')
    async checkHealth(): Promise<string> {
        return Promise.resolve('Server is up and running!');
    }
}
