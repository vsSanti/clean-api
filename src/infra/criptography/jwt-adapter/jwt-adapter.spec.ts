import jwt from 'jsonwebtoken';

import { throwError } from '@/domain/test';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'accessToken';
  },
  async verify (): Promise<string> {
    return 'any_value';
  },
}));

type SutTypes = {
  sut: JwtAdapter
}

const makeSut = (): SutTypes => {
  const sut = new JwtAdapter('secret');
  return {
    sut,
  };
};

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const { sut } = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');

      await sut.encrypt('any_id');

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return a token on sign success', async () => {
      const { sut } = makeSut();

      const accessToken = await sut.encrypt('any_id');

      expect(accessToken).toBe('accessToken');
    });

    it('should throw if sign throws', async () => {
      const { sut } = makeSut();

      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError);
      const promise = sut.encrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    it('should call verify with correct values', async () => {
      const { sut } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');

      await sut.decrypt('any_token');

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    it('should return a value on verify success', async () => {
      const { sut } = makeSut();

      const value = await sut.decrypt('any_id');

      expect(value).toBe('any_value');
    });

    it('should throw if verify throws', async () => {
      const { sut } = makeSut();

      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError);
      const promise = sut.decrypt('any_id');

      await expect(promise).rejects.toThrow();
    });
  });
});
