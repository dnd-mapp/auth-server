import fastifyHelmet from '@fastify/helmet';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

export async function configureHelmet(app: NestFastifyApplication) {
    await app.register(fastifyHelmet);
}
