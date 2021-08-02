import faker from 'faker';

import { AccountModel, AuthenticationModel } from '@/domain/models';
import { AddAccount, AddAccountParams, Authentication, AuthenticationParams, LoadAccountByToken } from '@/domain/usecases/account';
import { mockAccountModel } from '@/domain/test';

export class AddAccountSpy implements AddAccount {
  accountModel = mockAccountModel();
  addAccountParams: AddAccountParams;

  async add (account: AddAccountParams): Promise<AccountModel> {
    this.addAccountParams = account;
    return Promise.resolve(this.accountModel);
  }
}

export class AuthenticationSpy implements Authentication {
  authenticationParams: AuthenticationParams;
  authenticationModel = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.findName(),
  }

  async auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel> {
    this.authenticationParams = authenticationParams;
    return Promise.resolve(this.authenticationModel);
  }
}

export class LoadAccountByTokenSpy implements LoadAccountByToken {
  accountModel = mockAccountModel();
  accessToken: string;
  role: string;

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    this.accessToken = accessToken;
    this.role = role;
    return Promise.resolve(this.accountModel);
  }
}
