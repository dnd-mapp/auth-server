import { UpdateClientData } from '@/client/domain';
import { PickType } from '@nestjs/swagger';
import { ClientDto } from './client.dto';

export class UpdateClientDto
    extends PickType(ClientDto, ['name', 'allowedUris'] as const)
    implements UpdateClientData {}
