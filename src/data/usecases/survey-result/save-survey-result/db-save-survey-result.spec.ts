import MockDate from 'mockdate';

import { mockSaveSurveyResultRepository, mockLoadSurveyResultRepository } from '@/data/test';
import { mockSurveyResultModel, mockSaveSurveyResultParams, throwError } from '@/domain/test';

import { SaveSurveyResultRepository, LoadSurveyResultRepository } from './db-save-survey-result-protocols';
import { DbSaveSurveyResult } from './db-save-survey-result';

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository();
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();

  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  );

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub,
  };
};

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save');

    await sut.save(mockSaveSurveyResultParams());

    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams());
  });

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut();

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError);

    const errorPromise = sut.save(mockSaveSurveyResultParams());
    await expect(errorPromise).rejects.toThrow();
  });

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');

    await sut.save(mockSaveSurveyResultParams());

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams().surveyId);
  });

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();

    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);

    const errorPromise = sut.save(mockSaveSurveyResultParams());
    await expect(errorPromise).rejects.toThrow();
  });

  it('should return a survey result on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.save(mockSaveSurveyResultParams());

    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
