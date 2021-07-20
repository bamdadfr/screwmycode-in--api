import * as dotenv from 'dotenv';
import { isEnvProduction } from './is-env-production';

export function getMongoUrl() {
  if (!isEnvProduction()) dotenv.config();

  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}`;
}
