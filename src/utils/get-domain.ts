import { isEnvProduction } from './is-env-production.js';

export type GetDomain = 'https://api.screwmycode.in' | 'http://localhost:3000';

export function getDomain(): GetDomain {
  if (isEnvProduction()) {
    return 'https://api.screwmycode.in';
  } else {
    return 'http://localhost:3000';
  }
}
