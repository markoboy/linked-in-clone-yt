import { resolve } from 'path';

export interface IEnvHttp {
  host: string;
  port: number;
}

export interface IEnvDatabasePG {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface IEnvDatabaseSqLite {
  database: string;
}

export interface IEnvDatabase {
  postgres: IEnvDatabasePG;
  sqlite: IEnvDatabaseSqLite;
}

export interface IEnvAuth {
  secret: string;
}

export interface IEnvConfig {
  tempPath: string;
  http: IEnvHttp;
  db: IEnvDatabase;
  auth: IEnvAuth;
}

export interface IEnvConfigOptions {
  tempPath?: string;
}

function envConfig({ tempPath }: IEnvConfigOptions = {}): () => IEnvConfig {
  const path = tempPath || resolve(process.cwd(), '.temp');

  return () => ({
    tempPath: path,
    http: {
      host: process.env.HOST,
      port: +process.env.PORT,
    },
    db: {
      postgres: {
        host: process.env.POSTGRES_HOST,
        port: +process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
      },
      sqlite: {
        database: resolve(path, process.env.SQLITE_DATABASE),
      },
    },
    auth: {
      secret: process.env.JWT_SECRET,
    },
  });
}

export default envConfig;
