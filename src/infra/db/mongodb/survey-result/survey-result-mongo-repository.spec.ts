import { Collection, ObjectId } from 'mongodb';
import MockDate from 'mockdate';

import { AccountModel, SurveyModel } from '@/domain/models';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/test';

import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  return MongoHelper.map<SurveyModel>(res.ops[0]);
};

const mockAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return MongoHelper.map<AccountModel>(res.ops[0]);
};

describe('SurveyResultMongoRepository', () => {
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

  describe('save()', () => {
    it('should add a survey result if it is new', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();

      const sut = makeSut();

      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection.findOne({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });
      expect(surveyResult).toBeTruthy();
    });

    it('should update a survey result if it is not new', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(account.id),
        surveyId: new ObjectId(survey.id),
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();

      await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[1].answer,
        date: new Date(),
      });

      const surveyResult = await surveyResultCollection
        .find({
          accountId: account.id,
          surveyId: survey.id,
          answer: survey.answers[1].answer,
          date: new Date(),
        })
        .toArray();

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    it('should load a survey result', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();
      const account2 = await mockAccount();

      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          accountId: new ObjectId(account2.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, account.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    it('should load a survey result 2', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();
      const account2 = await mockAccount();
      const account3 = await mockAccount();

      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          accountId: new ObjectId(account2.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
        {
          accountId: new ObjectId(account3.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, account2.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    it('should load a survey result 3', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();
      const account2 = await mockAccount();
      const account3 = await mockAccount();

      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(account.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[0].answer,
          date: new Date(),
        },
        {
          accountId: new ObjectId(account2.id),
          surveyId: new ObjectId(survey.id),
          answer: survey.answers[1].answer,
          date: new Date(),
        },
      ]);

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, account3.id);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    it('should return null if there is no survey result', async () => {
      const survey = await mockSurvey();
      const account = await mockAccount();

      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, account.id);

      expect(surveyResult).toBeNull();
    });
  });
});
