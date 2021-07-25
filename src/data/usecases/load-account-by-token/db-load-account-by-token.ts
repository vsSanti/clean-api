import { LoadAccountByToken } from '../../../domain/usecases';
import { AccountModel } from '../../../domain/models';
import { Decrypter } from '../../protocols/criptography/decrypter';
import { LoadAccountByTokenRepository } from '../../protocols/db/account';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository,
  ) { }

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const validToken = await this.decrypter.decrypt(accessToken);
    if (!validToken) return null;

    await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
  }
}
