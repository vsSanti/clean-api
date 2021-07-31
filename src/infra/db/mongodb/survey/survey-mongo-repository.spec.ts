import { Collection } from 'mongodb';
import MockDate from 'mockdate';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddSurveyParams, mockSurveyModels } from '@/domain/test';

import { SurveyMongoRepository } from './survey-mongo-repository';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('Survey Mongo Repository', () => {
  let surveyCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    MockDate.reset();
  });

  describe('add()', () => {
    it('should add a survey on add success', async () => {
      const sut = makeSut();

      await sut.add(mockAddSurveyParams());

      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      await surveyCollection.insertMany(mockSurveyModels());
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[1].question).toBe('other_question');
    });

    it('should load empty list', async () => {
      const sut = makeSut();

      const surveys = await sut.loadAll();

      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const res = await surveyCollection.insertOne(mockAddSurveyParams());
      const sut = makeSut();

      const survey = await sut.loadById(res.ops[0]._id);

      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
      expect(survey.question).toBe('any_question');
      expect(survey.date).toEqual(new Date());
    });
  });
});
