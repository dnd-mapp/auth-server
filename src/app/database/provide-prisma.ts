export const PRISMA_CLIENT = Symbol('PRISMA_CLIENT');

export interface PrismaLikeClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaClientCtor = new (options: any) => PrismaLikeClient;

export type PrismaClientOptions<TClient extends PrismaClientCtor> = Omit<ConstructorParameters<TClient>[0], 'adapter'>;
