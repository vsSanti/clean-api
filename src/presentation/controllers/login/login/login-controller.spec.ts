import faker from 'faker';

import { MissingParamError, ServerError } from '@/presentation/errors';
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper';
import { AuthenticationSpy, ValidationSpy } from '@/presentation/test';
import { mockAuthenticationParams, throwError } from '@/domain/test';

import { HttpRequest } from './login-controller-protocols';
import { LoginController } from './login-controller';

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams(),
});

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy();
  const validationSpy = new ValidationSpy();

  const sut = new LoginController(authenticationSpy, validationSpy);

  return {
    sut,
    authenticationSpy,
    validationSpy,
  };
};

describe('Login Controller', () => {
  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    authenticationSpy.authenticationModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(authenticationSpy.authenticationModel));
  });

  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(validationSpy.input).toEqual(httpRequest.body);
  });

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
