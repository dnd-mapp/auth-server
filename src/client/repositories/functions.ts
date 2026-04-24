import { ClientType } from '@/client/domain';
import { Prisma } from '@/prisma/client';
import { ClientDto } from '../dtos';

export const selectedClientAttributes = {
    id: true,
    name: true,
    clientType: true,
    clientSecret: true,
    createdAt: true,
    updatedAt: true,
    allowedUris: { select: { uri: true } },
} satisfies Prisma.ClientSelect;

export type PrismaClientRecord = Prisma.ClientGetPayload<{ select: typeof selectedClientAttributes }>;

export function recordToClientDto(record: PrismaClientRecord): ClientDto {
    const dto = new ClientDto();
    dto.id = record.id;
    dto.name = record.name;
    dto.clientType = record.clientType as ClientType;
    dto.allowedUris = record.allowedUris.map((e) => e.uri);
    dto.createdAt = record.createdAt;
    dto.updatedAt = record.updatedAt;
    return dto;
}

export function recordsToClientDtos(records: PrismaClientRecord[]): ClientDto[] {
    return records.map((r) => recordToClientDto(r));
}
