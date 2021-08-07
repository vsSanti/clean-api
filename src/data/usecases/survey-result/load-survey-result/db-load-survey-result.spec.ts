import MockDate from 'mockdate';
import faker from 'faker';

import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test';

import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy,
  };
};

let surveyId: string;
let accountId: string;

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
    accountId = faker.datatype.uuid();
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    await sut.load(surveyId, accountId);
    expect(loadSurveyResultRepositorySpy.surveyId).toBe(surveyId);
    expect(loadSurveyResultRepositorySpy.accountId).toBe(accountId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError);
    const errorPromise = sut.load(surveyId, accountId);
    await expect(errorPromise).rejects.toThrow();
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null',
    async () => {
      const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut();
      loadSurveyResultRepositorySpy.surveyResultModel = null;
      await sut.load(surveyId, accountId);
      expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
    },
  );

  it('should return a surveyResult with answers with count 0 if LoadSurveyResultRepo returns null',
    async () => {
      const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut();
      loadSurveyResultRepositorySpy.surveyResultModel = null;
      const surveyResult = await sut.load(surveyId, accountId);
      const { surveyModel } = loadSurveyByIdRepositorySpy;
      expect(surveyResult).toEqual({
        surveyId: surveyModel.id,
        question: surveyModel.question,
        date: surveyModel.date,
        answers: surveyModel.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false,
        })),
      });
    },
  );

  it('should return a SurveyResultModel on success', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut();
    const surveyResult = await sut.load(surveyId, accountId);
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResultModel);
  });
});
