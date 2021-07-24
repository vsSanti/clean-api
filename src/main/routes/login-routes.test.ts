import { hash } from 'bcrypt';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('Login Routes', () => {
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

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Vinicius',
        email: 'viniciussdsilva@gmail.com',
        password,
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'viniciussdsilva@gmail.com',
          password: '123',
        })
        .expect(200);
    });
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
