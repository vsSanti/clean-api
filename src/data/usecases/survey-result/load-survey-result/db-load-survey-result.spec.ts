import MockDate from 'mockdate';

import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/test';
import { mockSurveyResultModel, throwError } from '@/domain/test';

import { LoadSurveyResultRepository, LoadSurveyByIdRepository } from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub);

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub,
  };
};

describe('DbLoadSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveyResultRepository with correct value', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);

    const errorPromise = sut.load('any_survey_id');
    await expect(errorPromise).rejects.toThrow();
  });

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null',
    async () => {
      const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut();
      const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById');
      jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockReturnValueOnce(Promise.resolve(null));

      await sut.load('any_survey_id');

      expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id');
    },
  );

  it('should return a surveyResult with answers with count 0 if LoadSurveyResultRepo returns null',
    async () => {
      const { sut, loadSurveyResultRepositoryStub } = makeSut();
      jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
        .mockReturnValueOnce(Promise.resolve(null));

      const surveyResult = await sut.load('any_survey_id');
      expect(surveyResult).toEqual(mockSurveyResultModel());
    },
  );

  it('should return a SurveyResultModel on success', async () => {
    const { sut } = makeSut();

    const surveyResult = await sut.load('any_survey_id');

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
