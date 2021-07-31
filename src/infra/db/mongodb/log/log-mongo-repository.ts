import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { LogErrorRepository } from '@/data/protocols/db/log';

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack?: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');

    await errorCollection.insertOne({
      stack,
      createdAt: new Date(),
    });
  }
}
