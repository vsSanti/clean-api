import { HasherSpy, AddAccountRepositorySpy, LoadAccountByEmailRepositorySpy } from '@/data/test';
import { mockAddAccountParams, mockAccountModel, throwError } from '@/domain/test';

import { DbAddAccount } from './db-add-account';

type SutTypes = {
  sut: DbAddAccount
  hasherSpy: HasherSpy
  addAccountRepositorySpy: AddAccountRepositorySpy
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherSpy = new HasherSpy();
  const addAccountRepositorySpy = new AddAccountRepositorySpy();
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();

  loadAccountByEmailRepositorySpy.accountModel = null;

  const sut = new DbAddAccount(
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  );

  return {
    sut,
    hasherSpy,
    addAccountRepositorySpy,
    loadAccountByEmailRepositorySpy,
  };
};

describe('DbAddAccount Usecase', () => {
  it('should call Hasher with correct password', async () => {
    const { sut, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(hasherSpy.plainText).toBe(addAccountParams.password);
  });

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut();
    jest.spyOn(hasherSpy, 'hash').mockImplementationOnce(throwError);
    const errorPromise = sut.add(mockAddAccountParams());
    await expect(errorPromise).rejects.toThrow();
  });

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositorySpy, hasherSpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);

    expect(addAccountRepositorySpy.addAccountParams).toEqual({
      name: addAccountParams.name,
      email: addAccountParams.email,
      password: hasherSpy.digest,
    });
  });

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();

    jest.spyOn(addAccountRepositorySpy, 'add').mockImplementationOnce(throwError);

    const errorPromise = sut.add(mockAddAccountParams());
    await expect(errorPromise).rejects.toThrow();
  });

  it('should return an account on success', async () => {
    const { sut, addAccountRepositorySpy } = makeSut();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(addAccountRepositorySpy.accountModel);
  });

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(addAccountParams.email);
  });

  it('should return null if LoadAccountByEmailRepository doesn\'t returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    loadAccountByEmailRepositorySpy.accountModel = mockAccountModel();
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });
});
