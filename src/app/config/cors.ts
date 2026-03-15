import { parseArrayFromString } from '@/shared-utils';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { CORS_MAX_AGE, DEFAULT_CORS_ORIGINS } from './constants';

export function configureCors(app: NestFastifyApplication) {
    const corsOrigins = parseArrayFromString(DEFAULT_CORS_ORIGINS, process.env['AUTH_SERVER_CORS_ORIGINS']);

    app.enableCors({
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
        maxAge: CORS_MAX_AGE,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: HttpStatus.NO_CONTENT,
        origin: [...corsOrigins],
    });
}
