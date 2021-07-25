import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'accessToken';
  },
  async verify (): Promise<string> {
    return 'any_value';
  },
}));

interface SutTypes {
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

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
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
  });
});
