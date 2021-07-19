import jwt from 'jsonwebtoken';

import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'accessToken';
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
});
