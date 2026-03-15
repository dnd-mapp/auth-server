import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('/health')
export class HealthController {
    private readonly healthCheckService: HealthCheckService;

    constructor(healthCheckService: HealthCheckService) {
        this.healthCheckService = healthCheckService;
    }

    @HealthCheck()
    @Get('/liveness')
    public async liveness() {
        return this.healthCheckService.check([]);
    }

    @HealthCheck()
    @Get('/readiness')
    public async readiness() {
        // TODO - Add check for database connection
        return this.healthCheckService.check([]);
    }
}
