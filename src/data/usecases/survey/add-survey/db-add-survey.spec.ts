import MockDate from 'mockdate';

import { AddSurveyRepositorySpy } from '@/data/test';
import { mockAddSurveyParams, throwError } from '@/domain/test';

import { DbAddSurvey } from './db-add-survey';

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();

  const sut = new DbAddSurvey(addSurveyRepositorySpy);

  return {
    sut,
    addSurveyRepositorySpy,
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
    const { sut, addSurveyRepositorySpy } = makeSut();
    const addSurveyParams = mockAddSurveyParams();
    await sut.add(addSurveyParams);
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(addSurveyParams);
  });

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError);
    const errorPromise = sut.add(mockAddSurveyParams());
    await expect(errorPromise).rejects.toThrow();
  });
});
