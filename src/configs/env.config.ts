import { existsSync, mkdirSync } from 'fs';
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

export interface IEnvMulter {
  imagePath: string;
}

export interface IEnvConfig {
  tempPath: string;
  http: IEnvHttp;
  db: IEnvDatabase;
  auth: IEnvAuth;
  multer: IEnvMulter;
}

export interface IEnvConfigOptions {
  tempPath?: string;
}

function generateMulterUploadDirectory(path: string): string {
  const uploadDestination = resolve(process.cwd(), path);

  try {
    if (!existsSync(uploadDestination)) {
      mkdirSync(uploadDestination);
    }
  } catch (error) {
    console.error('An error occurred while trying to create a directory');
    console.error(error);
  }

  return uploadDestination;
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
    multer: {
      imagePath: generateMulterUploadDirectory(process.env.MULTER_IMAGE_PATH),
    },
  });
}

export default envConfig;
