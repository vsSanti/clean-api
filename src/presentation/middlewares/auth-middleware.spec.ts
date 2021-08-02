import faker from 'faker';

import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { AccessDeniedError } from '@/presentation/errors';
import { LoadAccountByTokenSpy } from '@/presentation/test';
import { throwError } from '@/domain/test';

import { HttpRequest } from './auth-middleware-protocols';
import { AuthMiddleware } from './auth-middleware';

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': faker.datatype.uuid(),
  },
});

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenSpy: LoadAccountByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenSpy = new LoadAccountByTokenSpy();

  const sut = new AuthMiddleware(loadAccountByTokenSpy, role);

  return {
    sut,
    loadAccountByTokenSpy,
  };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpRespone = await sut.handle({});

    expect(httpRespone).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = faker.random.word();
    const { sut, loadAccountByTokenSpy } = makeSut(role);
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadAccountByTokenSpy.accessToken).toBe(httpRequest.headers['x-access-token']);
    expect(loadAccountByTokenSpy.role).toBe(role);
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    loadAccountByTokenSpy.accountModel = null;
    const httpRespone = await sut.handle(mockRequest());
    expect(httpRespone).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    const httpRespone = await sut.handle(mockRequest());
    expect(httpRespone).toEqual(ok({
      accountId: loadAccountByTokenSpy.accountModel.id,
    }));
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenSpy } = makeSut();
    jest.spyOn(loadAccountByTokenSpy, 'load').mockImplementationOnce(throwError);
    const httpRespone = await sut.handle(mockRequest());
    expect(httpRespone).toEqual(serverError(new Error()));
  });
});
