import { Collection } from 'mongodb';

import { MongoHelper } from '../helpers/mongo-helper';
import { SurveyMongoRepository } from './survey-mongo-repository';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  describe('add()', () => {
    it('should add a survey on add success', async () => {
      const sut = makeSut();

      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer',
          },
          {
            answer: 'another_answer',
          },
        ],
        date: new Date(),
      });

      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });
});
