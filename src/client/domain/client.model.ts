import { ClientType } from './client-type.enum';

export interface Client {
    id: string;
    name: string;
    clientType: ClientType;
    clientSecret: string | null;
    allowedUris: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type CreateClientData = Pick<Client, 'name' | 'allowedUris' | 'clientType' | 'clientSecret'>;

export type UpdateClientData = Pick<Client, 'name' | 'allowedUris' | 'clientType' | 'clientSecret'>;
