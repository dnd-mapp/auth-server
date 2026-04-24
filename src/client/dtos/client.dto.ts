import { Client, type ClientType, ClientTypes } from '@/client/domain';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class ClientDto implements Client {
    /**
     * The unique identifier for the client
     * @example '6uP8yIBni7G_SMObi1bUw'
     */
    @IsNotEmpty()
    @IsString()
    public id!: string;

    /**
     * The unique name of the client
     * @example 'dnd-mapp-web'
     */
    @MinLength(3)
    @IsNotEmpty()
    @IsString()
    public name!: string;

    /**
     * The OAuth 2.0 client type.
     * @example 'public'
     */
    @IsEnum(ClientTypes)
    public clientType!: ClientType;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public clientSecret!: string | null;

    /**
     * The list of allowed redirect URIs for the client.
     * @example ["https://localhost.dndmapp.dev"]
     */
    @IsArray()
    @IsUrl({ require_tld: false }, { each: true })
    public allowedUris!: string[];

    /**
     * The timestamp when the client was first created.
     * @example "2024-03-19T09:00:00.000Z"
     */
    @IsDate()
    public createdAt!: Date;

    /**
     * The timestamp when the client was last modified.
     * @example "2024-03-20T14:30:00.000Z"
     */
    @IsDate()
    public updatedAt!: Date;
}
