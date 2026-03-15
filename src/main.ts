import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

const DEFAULT_SERVER_PORT = 4350;

async function bootstrap() {
    const fastifyAdapter = new FastifyAdapter();

    const app = await NestFactory.create(AppModule, fastifyAdapter);

    const port = process.env['PORT'] ?? DEFAULT_SERVER_PORT;

    await app.listen(port);
}

bootstrap().catch((error) => console.error(error));
