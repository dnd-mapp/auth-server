import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureSwagger(app: NestFastifyApplication) {
    const appVersion = process.env['npm_package_version']!;

    const swaggerConfig = new DocumentBuilder().setTitle('D&D Mapp - Auth Server').setVersion(appVersion).build();

    SwaggerModule.setup('/docs', app, () => SwaggerModule.createDocument(app, swaggerConfig));
}
