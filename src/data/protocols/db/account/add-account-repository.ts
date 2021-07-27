import { AccountModel } from '@/domain/models';
import { AddAccountModel } from '@/domain/usecases/account';

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
