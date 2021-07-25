import { LoadAccountByToken } from '../../domain/usecases';
import { AccountModel } from '../../domain/models';
import { forbidden } from '../helpers/http/http-helper';
import { AccessDeniedError } from '../errors';

import { AuthMiddleware } from './auth-middleware';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'hashed_value',
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

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();

  const sut = new AuthMiddleware(loadAccountByTokenStub);

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
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle({
      headers: {
        'x-access-token': 'any_token',
      },
    });

    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });
});
