import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (uri?: string): Promise<void> {
    if (!uri) throw new Error('Should pass mongodb connection URI');

    this.uri = uri;

    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },

  async disconnect (): Promise<void> {
    if (!this.client?.isConnected()) return;

    await this.client.close();
    this.client = null as unknown as MongoClient;
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }

    return this.client.db().collection(name);
  },

  map<T> (data: any): T {
    const { _id, ...rest } = data;

    return { id: _id, ...rest };
  },

  mapCollection<T> (collection: any[]): T[] {
    return collection.map((c) => MongoHelper.map<T>(c));
  },
};
