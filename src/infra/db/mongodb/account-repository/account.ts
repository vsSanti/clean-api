import { AddAccountRepository } from '../../../../data/protocols';
import { AccountModel } from '../../../../domain/models';
import { AddAccountModel } from '../../../../domain/usecases';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map<AccountModel>(result.ops[0]);
  };
}
