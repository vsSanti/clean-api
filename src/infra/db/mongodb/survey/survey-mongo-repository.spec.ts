import { Collection } from 'mongodb';
import MockDate from 'mockdate';

import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { AccountModel } from '@/domain/models';
import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/test';

import { SurveyMongoRepository } from './survey-mongo-repository';

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return MongoHelper.map<AccountModel>(res.ops[0]);
};

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

describe('SurveyMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
    MockDate.set(new Date());
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('survey-results');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    MockDate.reset();
  });

  describe('add()', () => {
    it('should add a survey on add success', async () => {
      const sut = makeSut();
      await sut.add(mockAddSurveyParams());
      const count = await surveyCollection.countDocuments();
      expect(count).toBe(1);
    });
  });

  describe('loadAll()', () => {
    it('should load all surveys on success', async () => {
      const account = await mockAccount();
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()];
      const result = await surveyCollection.insertMany(addSurveyModels);
      const survey = result.ops[0];
      await surveyResultCollection.insertOne({
        surveyId: survey._id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      const sut = makeSut();

      const surveys = await sut.loadAll(account.id);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe(addSurveyModels[0].question);
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe(addSurveyModels[1].question);
      expect(surveys[1].didAnswer).toBe(false);
    });

    it('should load empty list', async () => {
      const account = await mockAccount();
      const sut = makeSut();

      const surveys = await sut.loadAll(account.id);

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
    });
  });
});
