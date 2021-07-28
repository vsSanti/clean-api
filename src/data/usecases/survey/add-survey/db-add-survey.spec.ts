import MockDate from 'mockdate';

import { mockAddSurveyRepository } from '@/data/test';
import { mockAddSurveyParams, throwError } from '@/domain/test';

import { AddSurveyRepository } from './db-add-survey-protocols';
import { DbAddSurvey } from './db-add-survey';

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();

  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub,
  };
};

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');

    await sut.add(mockAddSurveyParams());

    expect(addSpy).toHaveBeenCalledWith(mockAddSurveyParams());
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError);

    const errorPromise = sut.add(mockAddSurveyParams());
    await expect(errorPromise).rejects.toThrow();
  });
});
