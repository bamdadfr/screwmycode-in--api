import { buildResponseFromError } from './build-response-from-error';

describe('buildResponseFromError', () => {
  it('should build a correct response', () => {
    const message = 'this is my testing error message';

    expect(buildResponseFromError(new Error(message))).toStrictEqual({
      success: false,
      error: {
        message: message,
      },
    });
  });
});
