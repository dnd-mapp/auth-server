import { ClientType } from '../client.constants';

export interface Client {
    id: string;
    name: string;
    clientType: ClientType;
    allowedUris: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type CreateClientData = Pick<Client, 'name' | 'allowedUris' | 'clientType'>;
export type UpdateClientData = Pick<Client, 'name' | 'allowedUris' | 'clientType'>;
