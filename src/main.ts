import { AppModule, DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT } from '@/app';
import { parseInteger } from '@/shared-utils';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create(AppModule, fastifyAdapter);

    const port = parseInteger(DEFAULT_SERVER_PORT, process.env['AUTH_SERVER_PORT']);
    const host = process.env['AUTH_SERVER_HOST'] ?? DEFAULT_SERVER_HOST;

    app.enableShutdownHooks();

    await app.listen(port, host);
}

bootstrap().catch((error) => console.error(error));
