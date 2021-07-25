import { Decrypter } from '../../protocols/criptography';

import { DbLoadAccountByToken } from './db-load-account-by-token';

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (accessToken: string): Promise<string> {
      return 'valid_id';
    }
  }

  return new DecrypterStub();
};

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();

  const sut = new DbLoadAccountByToken(decrypterStub);
  return {
    sut,
    decrypterStub,
  };
};

describe('DbLoadAccountByToken Usecase', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');
    await sut.load('any_token', 'any_role');

    expect(decryptSpy).toHaveBeenCalledWith('any_token');
  });

  it('should retur null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut();
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const account = await sut.load('any_token', 'any_role');

    expect(account).toBeNull();
  });
});
