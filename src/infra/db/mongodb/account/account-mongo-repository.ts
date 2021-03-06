import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { AccountModel } from '@/domain/models';
import { AddAccountParams } from '@/domain/usecases/account';
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols/db/account';

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository {
  async add (data: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(data);

    return MongoHelper.map<AccountModel>(result.ops[0]);
  };

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map<AccountModel>(account);
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [
        { role },
        { role: 'admin' },
      ],
    });

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
