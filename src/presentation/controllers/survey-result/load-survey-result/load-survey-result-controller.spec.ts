import MockDate from 'mockdate';
import faker from 'faker';

import { InvalidParamError } from '@/presentation/errors';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test';
import { throwError } from '@/domain/test';

import { HttpRequest } from './load-survey-result-controller-protocols';
import { LoadSurveyResultController } from './load-survey-result-controller';

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid(),
  },
});

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdSpy: LoadSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdSpy = new LoadSurveyByIdSpy();
  const loadSurveyResultSpy = new LoadSurveyResultSpy();
  const sut = new LoadSurveyResultController(loadSurveyByIdSpy, loadSurveyResultSpy);

  return {
    sut,
    loadSurveyByIdSpy,
    loadSurveyResultSpy,
  };
};

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  it('should call LoadSurveyById with correct id', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveyByIdSpy.id).toBe(httpRequest.params.surveyId);
  });

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    loadSurveyByIdSpy.surveyModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')));
  });

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdSpy } = makeSut();
    jest.spyOn(loadSurveyByIdSpy, 'loadById').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should call LoadSurveyResult with correct id', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId);
  });

  it('should return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    jest.spyOn(loadSurveyResultSpy, 'load').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('should return 200 on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.surveyResultModel));
  });
});
