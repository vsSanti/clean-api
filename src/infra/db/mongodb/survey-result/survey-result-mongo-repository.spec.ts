import { Collection } from 'mongodb';
import MockDate from 'mockdate';

import { AccountModel, SurveyModel } from '@/domain/models';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';
import { mockAddSurveyParams, mockAddAccountParams } from '@/domain/test';

import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams());
  return MongoHelper.map<SurveyModel>(res.ops[0]);
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams());
  return MongoHelper.map<AccountModel>(res.ops[0]);
};

describe('Survey Mongo Repository', () => {
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
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
    MockDate.reset();
  });

  describe('save()', () => {
    it('should add a survey result if it is new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();

      const sut = makeSut();

      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toBeTruthy();
      expect(surveyResult.answer).toBe(survey.answers[0].answer);
    });

    it('should update a survey result if it is not new', async () => {
      const survey = await makeSurvey();
      const account = await makeAccount();
      const res = await surveyResultCollection.insertOne({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      const sut = makeSut();

      const surveyResult = await sut.save({
        accountId: account.id,
        surveyId: survey.id,
        answer: survey.answers[0].answer,
        date: new Date(),
      });

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.id).toEqual(res.ops[0]._id);
      // expect(surveyResult.answer).toBe(survey.answers[1].answer);
    });
  });
});
