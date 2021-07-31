import { Collection } from 'mongodb';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import app from '@/main/config/app';
import env from '@/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Vinicius',
    email: 'viniciussdsilva@gmail.com',
    password: '123',
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

describe('SurveyResult Routes', () => {
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

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403);
    });
  });

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer',
        })
        .expect(403);
    });

    it('should return 200 with valid accessToken', async () => {
      const accessToken = await mockAccessToken();

      const res = await surveyCollection.insertOne({
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
        date: new Date(),
      });
      const surveyId: string = res.ops[0]._id;

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer',
        })
        .expect(200);
    });
  });
});
