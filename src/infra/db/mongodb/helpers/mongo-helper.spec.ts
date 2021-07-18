import { MongoHelper as sut } from './mongo-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('should reconnect if mongodb connection is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();

    await sut.disconnect();

    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });

  it('should throw if no uri is passed on connect', async () => {
    const connectPromise = sut.connect(undefined);

    await expect(connectPromise).rejects.toThrow();
  });
});
