import { getMongoUrl } from './get-mongo-url';

describe('getMongoUrl', () => {
  it('should be defined if NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    expect(getMongoUrl()).toBeDefined();
  });

  it('should be defined if NODE_ENV is not production', () => {
    process.env.NODE_ENV = undefined;
    expect(getMongoUrl()).toBeDefined();
  });
});
