import { Collection } from 'mongodb';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Vinicius',
    email: 'viniciussdsilva@gmail.com',
    password: '123',
    role: 'admin',
  });
  const id = res.ops[0]._id;
  const accessToken = await jwt.sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({ _id: id }, {
    $set: {
      accessToken,
    },
  });

  return accessToken;
};

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('POST /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .expect(403);
    });

    it('should return 204 with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'Answer',
            },
            {
              answer: 'Other Answer',
            },
          ],
        })
        .expect(204);
    });
  });

  describe('GET /surveys', () => {
    it('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403);
    });

    it('should return 204 on load no surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204);
    });
  });
});
