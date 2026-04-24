import { ClientTypes } from '@/client/domain/client-type.enum';
import { nanoid } from 'nanoid';
import { Client } from './client.model';

export class ClientBuilder {
    private readonly client: Client;

    constructor() {
        const id = nanoid();
        const timestamp = new Date();

        this.client = {
            id: id,
            name: `client-${id}`,
            clientType: ClientTypes.PUBLIC,
            clientSecret: null,
            allowedUris: [],
            createdAt: timestamp,
            updatedAt: timestamp,
        };
    }

    public build() {
        return this.client;
    }

    public withId(id: string) {
        this.client.id = id;
        return this;
    }

    public withName(name: string) {
        this.client.name = name;
        return this;
    }

    public public(secret: string) {
        this.client.clientType = ClientTypes.PUBLIC;
        this.client.clientSecret = secret;
        return this;
    }

    public confidential() {
        this.client.clientSecret = null;
        this.client.clientType = ClientTypes.CONFIDENTIAL;
        return this;
    }

    public withAllowedUris(allowedUris: string[]) {
        this.client.allowedUris = allowedUris;
        return this;
    }

    public withCreatedAt(timestamp: Date) {
        this.client.createdAt = timestamp;
        return this;
    }

    public withUpdatedAt(timestamp: Date) {
        this.client.updatedAt = timestamp;
        return this;
    }
}
