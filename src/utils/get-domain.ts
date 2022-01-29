import { isEnvProduction } from './is-env-production.js';

export function getDomain() {
  if (isEnvProduction()) {
    return 'https://api.screwmycode.in';
  } else {
    return 'http://localhost:3000';
  }
}
