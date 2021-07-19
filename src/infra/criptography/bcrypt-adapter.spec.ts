import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  },
  async compare (): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('should call hash with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a valid hash on hash success', async () => {
    const sut = makeSut();
    const hashedValue = await sut.hash('any_value');

    expect(hashedValue).toBe('hash');
  });

  it('should throw if Bcrypt throws', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const hashedValuePromise = sut.hash('any_value');

    await expect(hashedValuePromise).rejects.toThrow();
  });

  it('should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  it('should return true when compere succeeds', async () => {
    const sut = makeSut();
    const hashedValue = await sut.compare('any_value', 'any_hash');

    expect(hashedValue).toBe(true);
  });
});
