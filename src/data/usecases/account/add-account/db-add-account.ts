import {
  AccountModel,
  AddAccount,
  AddAccountParams,
  Hasher,
  AddAccountRepository,
  LoadAccountByEmailRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
  ) { }

  async add (data: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(data.email);
    if (account) return null;

    const hashedPassword = await this.hasher.hash(data.password);
    const newAccount = await this.addAccountRepository.add({
      ...data,
      password: hashedPassword,
    });

    return newAccount;
  }
}
