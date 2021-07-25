import {
  AccountModel,
  HttpRequest,
  LoadAccountByToken,
} from './auth-middleware-protocols';
import { forbidden, ok, serverError } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';

import { AuthMiddleware } from './auth-middleware';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_value',
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenStub();
};

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();

  const sut = new AuthMiddleware(loadAccountByTokenStub, role);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpRespone = await sut.handle({});

    expect(httpRespone).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should call LoadAccountByToken with correct accessToken', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_token', role);
  });

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpRespone = await sut.handle({});

    expect(httpRespone).toEqual(forbidden(new AccessDeniedError()));
  });

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpRespone = await sut.handle(makeFakeRequest());

    expect(httpRespone).toEqual(ok({
      accountId: 'valid_id',
    }));
  });

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRespone = await sut.handle(makeFakeRequest());

    expect(httpRespone).toEqual(serverError(new Error()));
  });
});
