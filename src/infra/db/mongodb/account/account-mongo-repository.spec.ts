import faker from 'faker';
import { Collection } from 'mongodb';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddAccountParams } from '@/domain/test';

import { AccountMongoRepository } from './account-mongo-repository';

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('AccountMongoRepository', () => {
  let accountCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      const account = await sut.add(addAccountParams);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });
  });

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      const addAccountParams = mockAddAccountParams();
      await accountCollection.insertOne(addAccountParams);
      const account = await sut.loadByEmail(addAccountParams.email);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(addAccountParams.name);
      expect(account.email).toBe(addAccountParams.email);
      expect(account.password).toBe(addAccountParams.password);
    });

    it('should return null if loadByEmail returns null', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail(faker.internet.email());

      expect(account).toBeFalsy();
    });
  });

  describe('loadByToken()', () => {
    let name: string;
    let email: string;
    let password: string;
    let accessToken: string;

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.datatype.uuid();
    });

    it('should return an account on loadByToken without role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    it('should return an account on loadByToken with admin role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    it('should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken, 'admin');

      expect(account).toBeFalsy();
    });

    it('should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name,
        email,
        password,
        accessToken,
        role: 'admin',
      });
      const account = await sut.loadByToken(accessToken);

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe(name);
      expect(account.email).toBe(email);
      expect(account.password).toBe(password);
    });

    it('should return null if loadByToken returns null', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);

      expect(account).toBeFalsy();
    });
  });

  describe('updateAccessToken()', () => {
    it('should update account accessToken on update accessToken success', async () => {
      const sut = makeSut();
      const result = await accountCollection.insertOne(mockAddAccountParams());

      const fakeAccount = result.ops[0];
      expect(fakeAccount.accessToken).toBeFalsy();
      const accessToken = faker.datatype.uuid();
      await sut.updateAccessToken(fakeAccount._id, accessToken);
      const account = await accountCollection.findOne({ _id: fakeAccount._id });

      expect(account).toBeTruthy();
      expect(account.accessToken).toBe(accessToken);
    });
  });
});
