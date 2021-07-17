import bcrypt from 'bcrypt';

import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => {
  return {
    async hash (): Promise<string> {
      return new Promise((resolve) => resolve('hash'));
    },
  };
});

describe('Bcrypt Adapter', () => {
  it('should call Bcrypt with correct values', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const bcryptSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');

    expect(bcryptSpy).toHaveBeenCalledWith('any_value', salt);
  });

  it('should return a hash on success', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashedValue = await sut.encrypt('any_value');

    expect(hashedValue).toBe('hash');
  });
});
