import { Collection } from 'mongodb';

import { MongoHelper } from '@/infra/db/mongodb/helpers';

import { LogMongoRepository } from './log-mongo-repository';

type SutTypes = {
  sut: LogMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository();

  return {
    sut,
  };
};

describe('Log Mongo Repository', () => {
  let errorCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it('should create an error log on success', async () => {
    const { sut } = makeSut();
    await sut.logError('any_error');

    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
