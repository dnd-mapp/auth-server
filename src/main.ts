import { AppModule, DEFAULT_CORS_ORIGINS, DEFAULT_SERVER_HOST, DEFAULT_SERVER_PORT } from '@/app';
import { parseArrayFromString, parseInteger } from '@/shared-utils';
import fastifyHelmet from '@fastify/helmet';
import { HttpStatus, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);

    const port = parseInteger(DEFAULT_SERVER_PORT, process.env['AUTH_SERVER_PORT']);
    const host = process.env['AUTH_SERVER_HOST'] ?? DEFAULT_SERVER_HOST;
    const corsOrigins = parseArrayFromString(DEFAULT_CORS_ORIGINS, process.env['AUTH_SERVER_CORS_ORIGINS']);

    await app.register(fastifyHelmet);

    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        maxAge: 3600,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: HttpStatus.NO_CONTENT,
        origin: [...corsOrigins],
    });

    app.enableShutdownHooks();

    await app.listen(port, host, () => {
        const url = `http://${host}:${port}`;

        Logger.log(`Nest application available at: ${url}`, 'NestApplication');
    });
}

bootstrap().catch((error) => console.error(error));
