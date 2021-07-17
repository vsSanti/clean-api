import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri?: string): Promise<void> {
    if (!uri) throw new Error('Should pass mongodb connection URI');
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect (): Promise<void> {
    await this.client.close();
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name);
  },

  map<T> (collection: any): T {
    const { _id, ...obj } = collection;

    return { id: _id, ...obj };
  },
};
