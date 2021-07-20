import { isEnvProduction } from './is-env-production';

export function getMongoUrl() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  if (!isEnvProduction()) require('dotenv').config();

  return `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}`;
}
