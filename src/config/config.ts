import * as dotenv from 'dotenv';

dotenv.config();

interface Config {
    HTTP_PORT: number;
    WS_PORT: number;
}

const config: Config = {
    HTTP_PORT: parseInt(process.env.HTTP_PORT || '8181', 10),
    WS_PORT: parseInt(process.env.WS_PORT || '3000', 10),
};

export default config;
