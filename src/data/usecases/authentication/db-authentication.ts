import { Authentication, AuthenticationModel } from '../../../domain/usecases';
import { HashComparer, TokenGenerator } from '../../protocols/criptography';
import { LoadAccountByEmailRepository } from '../../protocols/db';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashComparer = hashComparer;
    this.tokenGenerator = tokenGenerator;
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);
    if (!account) return null;

    const isValidPassword = await this.hashComparer
      .compare(authentication.password, account.password);
    if (!isValidPassword) return null;

    const accessToken = await this.tokenGenerator.generate(account.id);

    return accessToken;
  }
}
