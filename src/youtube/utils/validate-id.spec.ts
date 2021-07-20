import { validateId } from './validate-id';

describe('validateId', () => {
  it('should not throw when id is valid', () => {
    const id = 'UY6dvVeuzk4';
    expect(() => validateId(id)).not.toThrowError();
  });

  it('should throw when id is not valid', () => {
    expect(() => validateId('zeikorjzeiuofh')).toThrowError(
      new Error('id is not valid'),
    );
  });
});
