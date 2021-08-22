import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  // synchronize: true,
}));
