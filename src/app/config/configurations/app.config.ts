import { ConfigurationNamespaces } from './configuration-namespaces';
import { ServerConfig } from './server.config';

export interface AppConfig {
    [ConfigurationNamespaces.SERVER]: ServerConfig;
}
