import { CreateClientData } from '@/client/domain';
import { PickType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClientType, ClientTypes } from '../client.constants';
import { ClientDto } from './client.dto';

export class CreateClientDto
    extends PickType(ClientDto, ['name', 'allowedUris'] as const)
    implements CreateClientData
{
    @IsEnum(ClientTypes)
    @IsOptional()
    public clientType: ClientType = ClientTypes.PUBLIC;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public clientSecret?: string;
}
