import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT!,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'homebranch',
  synchronize: false,
  dropSchema: false,
  logging: false,
  logger: 'file',
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  migrationsTableName: 'migration_table',
  namingStrategy: new SnakeNamingStrategy(),
});
