import { AccountModel } from '@/domain/models';
import { AddAccountParams, AuthenticationParams } from '@/domain/usecases/account';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), {
  id: 'any_id',
  password: 'hashed_value',
});

export const mockAuthentication = (): AuthenticationParams => ({
  email: 'any_email@email.com',
  password: 'any_password',
});
