export interface Client {
    id: string;
    name: string;
    allowedUris: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type CreateClientData = Pick<Client, 'name' | 'allowedUris'>;
export type UpdateClientData = Pick<Client, 'name' | 'allowedUris'>;
