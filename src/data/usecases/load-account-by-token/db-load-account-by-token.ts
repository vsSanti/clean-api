import { AccountModel, Decrypter, LoadAccountByTokenRepository, LoadAccountByToken } from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const validToken = await this.decrypter.decrypt(accessToken);
    if (!validToken) return null;

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
    if (!account) return null;

    return account;
  }
}
