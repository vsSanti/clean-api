import request from 'supertest';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('Login Routes', () => {

  });

  describe('POST /signup', () => {
    it('should return 201 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Vinicius',
          email: 'viniciussdsilva@gmail.com',
          password: '123',
          passwordConfirmation: '123',
        })
        .expect(201);
    });
  });
});
