import { mockLoadSurveyResultRepository } from '@/data/test';
import { throwError } from '@/domain/test';

import { LoadSurveyResultRepository } from './db-load-survey-result-protocols';
import { DbLoadSurveyResult } from './db-load-survey-result';

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);

  return {
    sut,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbLoadSurveyResult Usecase', () => {
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
});
