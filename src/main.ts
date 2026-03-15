import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_SERVER_PORT = 4350;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env['PORT'] ?? DEFAULT_SERVER_PORT);
}

bootstrap().catch((error) => console.error(error));
