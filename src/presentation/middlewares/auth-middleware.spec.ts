import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';

import { AuthMiddleware } from './auth-middleware';

interface SutTypes {
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const sut = new AuthMiddleware();

  return {
    sut,
  };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpRespone = await sut.handle({});

    expect(httpRespone).toEqual(forbidden(new AccessDeniedError()));
  });
});
