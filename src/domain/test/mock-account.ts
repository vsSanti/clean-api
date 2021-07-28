import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases/account';

export const mockAccountModel = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password',
});

export const mockAddAccountParams = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_value',
});
