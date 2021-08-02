import faker from 'faker';

import { DecrypterSpy, LoadAccountByTokenRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test';

import { DbLoadAccountByToken } from './db-load-account-by-token';

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterSpy: DecrypterSpy
  loadAccountByTokenRepositorySpy: LoadAccountByTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy();
  const loadAccountByTokenRepositorySpy = new LoadAccountByTokenRepositorySpy();

  const sut = new DbLoadAccountByToken(decrypterSpy, loadAccountByTokenRepositorySpy);
  return {
    sut,
    decrypterSpy,
    loadAccountByTokenRepositorySpy,
  };
};

let token: string;
let role: string;

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.datatype.uuid();
    role = faker.random.word();
  });

  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterSpy } = makeSut();
    await sut.load(token, role);
    expect(decrypterSpy.cipherText).toBe(token);
  });

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut();
    decrypterSpy.plainText = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    await sut.load(token, role);
    expect(loadAccountByTokenRepositorySpy.token).toBe(token);
    expect(loadAccountByTokenRepositorySpy.role).toBe(role);
  });

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    loadAccountByTokenRepositorySpy.accountModel = null;
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  it('should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();
    const account = await sut.load(token, role);

    expect(account).toEqual(loadAccountByTokenRepositorySpy.accountModel);
  });

  it('should return null if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut();
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError);
    const account = await sut.load(token, role);
    expect(account).toBeNull();
  });

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositorySpy } = makeSut();

    jest.spyOn(loadAccountByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError);

    const errorPromise = sut.load(token, role);
    await expect(errorPromise).rejects.toThrow();
  });
});
