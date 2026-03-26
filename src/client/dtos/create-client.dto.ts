import { CreateClientData } from '@/client/domain';
import { PickType } from '@nestjs/swagger';
import { ClientDto } from './client.dto';

export class CreateClientDto
    extends PickType(ClientDto, ['name', 'allowedUris'] as const)
    implements CreateClientData {}
