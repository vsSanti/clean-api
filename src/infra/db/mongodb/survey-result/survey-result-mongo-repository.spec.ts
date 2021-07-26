import { Collection } from 'mongodb';
import MockDate from 'mockdate';

import { AccountModel, SurveyModel } from '@/domain/models';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

import { SurveyResultMongoRepository } from './survey-result-mongo-repository';

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
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
  return MongoHelper.map<SurveyModel>(res.ops[0]);
};

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_email@email.com',
    password: 'any_password',
  });
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
  });
});
