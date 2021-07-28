import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases/account';

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
