import { UpdateClientData } from '@/client/domain';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClientType, ClientTypes } from '../client.constants';
import { ClientDto } from './client.dto';

export class UpdateClientDto
    extends PickType(ClientDto, ['name', 'allowedUris'] as const)
    implements UpdateClientData
{
    @IsEnum(ClientTypes)
    @IsOptional()
    public clientType: ClientType = ClientTypes.PUBLIC;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public clientSecret?: string;
}
