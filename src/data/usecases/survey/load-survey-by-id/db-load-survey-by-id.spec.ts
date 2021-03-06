import MockDate from 'mockdate';
import faker from 'faker';

import { LoadSurveyByIdRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test';

import { DbLoadSurveyById } from './db-load-survey-by-id';

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy();
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositorySpy);

  return {
    sut,
    loadSurveyByIdRepositorySpy,
  };
};

let surveyId: string;

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  beforeEach(() => {
    surveyId = faker.datatype.uuid();
  });

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    await sut.loadById(surveyId);

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId);
  });

  it('should return a survey on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    const survey = await sut.loadById(surveyId);
    expect(survey).toEqual(loadSurveyByIdRepositorySpy.surveyModel);
  });

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut();
    jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockImplementationOnce(throwError);
    const errorPromise = sut.loadById(surveyId);
    await expect(errorPromise).rejects.toThrow();
  });
});
