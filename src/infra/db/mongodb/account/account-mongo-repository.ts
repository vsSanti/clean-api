import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '../../../../data/protocols/db/account';
import { AccountModel } from '../../../../domain/models';
import { AddAccountModel } from '../../../../domain/usecases';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map<AccountModel>(result.ops[0]);
  };

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map<AccountModel>(account);
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    await accountCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token,
      },
    });
  }
}
