import { DbAddAccount } from './db-add-account';

describe('DbAddAccount Usecase', () => {
  it('should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await new Promise((resolve) => resolve('hashed_value'));
      }
    }

    const encrypterStub = new EncrypterStub();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const sut = new DbAddAccount(encrypterStub);
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    };
    await sut.add(accountData);

    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
