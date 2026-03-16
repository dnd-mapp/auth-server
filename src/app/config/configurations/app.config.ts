import { ConfigurationNamespaces } from './configuration-namespaces';
import { DatabaseConfig } from './database.config';
import { ServerConfig } from './server.config';

export interface AppConfig {
    [ConfigurationNamespaces.SERVER]: ServerConfig;
    [ConfigurationNamespaces.DATABASE]: DatabaseConfig;
}
