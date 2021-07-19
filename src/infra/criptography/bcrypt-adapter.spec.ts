import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  it('should call Bcrypt with correct values', async () => {
    const sut = makeSut();
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hash('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
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
});
