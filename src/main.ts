import {
    AppModule,
    configureCors,
    configureFastifyAdapter,
    configureHelmet,
    configureSwagger,
    DEFAULT_SERVER_HOST,
    DEFAULT_SERVER_PORT,
} from '@/app';
import { parseInteger } from '@/shared-utils';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
    const { adapter, ssl } = await configureFastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);

    const port = parseInteger(DEFAULT_SERVER_PORT, process.env['AUTH_SERVER_PORT']);
    const host = process.env['AUTH_SERVER_HOST'] ?? DEFAULT_SERVER_HOST;

    await configureHelmet(app);
    await configureSwagger(app);
    configureCors(app);

    app.enableShutdownHooks();

    await app.listen(port, host, () => {
        const url = `${ssl ? 'https' : 'http'}://${host}:${port}`;

        Logger.log(`Nest application available at: ${url}`, 'NestApplication');
    });
}

bootstrap().catch((error) => console.error(error));
