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
  describe('hash()', () => {
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

    it('should throw if hash throws', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.hash('any_value');

      await expect(promise).rejects.toThrow();
    });
  });
  describe('compare()', () => {
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

    it('should return false when compere fails', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
      const hashedValue = await sut.compare('any_value', 'any_hash');

      expect(hashedValue).toBe(false);
    });

    it('should throw if compare throws', async () => {
      const sut = makeSut();

      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.compare('any_value', 'any_hash');

      await expect(promise).rejects.toThrow();
    });
  });
});
