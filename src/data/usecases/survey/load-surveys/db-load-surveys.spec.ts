import MockDate from 'mockdate';

import { LoadSurveysRepositorySpy } from '@/data/test';
import { throwError } from '@/domain/test';

import { DbLoadSurveys } from './db-load-surveys';

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepositorySpy: LoadSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveysRepositorySpy = new LoadSurveysRepositorySpy();
  const sut = new DbLoadSurveys(loadSurveysRepositorySpy);

  return {
    sut,
    loadSurveysRepositorySpy,
  };
};

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    await sut.load();
    expect(loadSurveysRepositorySpy.callsCount).toBe(1);
  });

  it('should return a list of Surveys on success', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    const surveys = await sut.load();
    expect(surveys).toEqual(loadSurveysRepositorySpy.surveyModels);
  });

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositorySpy } = makeSut();
    jest.spyOn(loadSurveysRepositorySpy, 'loadAll').mockImplementationOnce(throwError);
    const errorPromise = sut.load();
    await expect(errorPromise).rejects.toThrow();
  });
});
