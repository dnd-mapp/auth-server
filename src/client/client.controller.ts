import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    NotFoundException,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { ClientDto, CreateClientDto, UpdateClientDto } from './dtos';
import { ClientService } from './services';

@Controller('/clients')
export class ClientController {
    private readonly logger = new Logger(ClientController.name);
    private readonly clientService: ClientService;

    constructor(clientService: ClientService) {
        this.clientService = clientService;
    }

    /**
     * Retrieve a list of all clients.
     *
     * @remarks Fetches all client records from the database,
     * ordered alphabetically by name.
     *
     * @returns A list of client DTOs.
     * @throws {500} If the database query fails.
     */
    @Get()
    public async getAll(): Promise<ClientDto[]> {
        this.logger.log('Fetching all clients');
        return await this.clientService.getAll();
    }

    /**
     * Create a new client.
     *
     * @remarks Registers a new client in the system. Validates that the
     * client name is unique before persistence.
     *
     * @param data The client data (e.g., name, allowedUris).
     * @param response Fastify response object to set the Location header.
     * @returns The newly created client record.
     * @throws {409} If the client name is already taken.
     * @throws {500} If the database insertion fails.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() data: CreateClientDto,
        @Res({ passthrough: true }) response: FastifyReply
    ): Promise<ClientDto> {
        this.logger.log(`Received request to create a new client: "${data.name}"`);

        const created = await this.clientService.create(data);

        response.headers({ location: `/clients/${created.id}` });
        return created;
    }

    /**
     * Retrieve a single client by ID.
     *
     * @remarks Finds a client record by its unique identifier.
     *
     * @param clientId The unique ID of the client.
     * @returns The client object.
     * @throws {404} If no client is found with the provided ID.
     * @throws {500} If the database query fails.
     */
    @Get('/:clientId')
    public async getById(@Param('clientId') clientId: string): Promise<ClientDto> {
        this.logger.log(`Fetching client with ID "${clientId}"`);
        const byId = await this.clientService.getById(clientId);

        if (!byId) {
            this.logger.warn(`Client lookup failed: ID "${clientId}" not found`);
            throw new NotFoundException(`Client with ID "${clientId}" was not found`);
        }
        return byId;
    }

    /**
     * Update an existing client.
     *
     * @remarks Modifies client information based on the provided ID.
     * Validates that the new name is not already in use by another client.
     *
     * @param clientId The unique ID of the client.
     * @param data The updated client data (e.g., name, allowedUris).
     * @returns The updated client record.
     * @throws {404} If the client does not exist.
     * @throws {409} If the new name is already in use.
     * @throws {500} If the database update fails.
     */
    @Put('/:clientId')
    public async updateById(@Param('clientId') clientId: string, @Body() data: UpdateClientDto): Promise<ClientDto> {
        this.logger.log(`Request to update client with ID "${clientId}"`);

        return await this.clientService.update(clientId, data);
    }

    /**
     * Delete a client.
     *
     * @remarks Permanently removes a client record from the database.
     *
     * @param clientId The unique ID of the client to remove.
     * @throws {404} If the client does not exist.
     * @throws {500} If the database query fails.
     */
    @Delete('/:clientId')
    @HttpCode(HttpStatus.NO_CONTENT)
    public async removeById(@Param('clientId') clientId: string): Promise<void> {
        this.logger.log(`Initiating delete for client ID "${clientId}"`);

        await this.clientService.removeById(clientId);

        this.logger.log(`Client ID "${clientId}" successfully removed`);
    }
}
