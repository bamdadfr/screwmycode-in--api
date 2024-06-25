import { RestrictDomainMiddleware } from './restrict-domain.middleware.js';

describe('RestrictDomainMiddleware', () => {
  it('should be defined', () => {
    expect(new RestrictDomainMiddleware()).toBeDefined();
  });
});
