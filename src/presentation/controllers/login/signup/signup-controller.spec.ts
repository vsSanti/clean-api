import faker from 'faker';

import { EmailInUseError, MissingParamError, ServerError } from '@/presentation/errors';
import { HttpRequest } from '@/presentation/protocols';
import { badRequest, created, serverError, forbidden } from '@/presentation/helpers/http/http-helper';
import { AddAccountSpy, AuthenticationSpy, ValidationSpy } from '@/presentation/test';
import { throwError } from '@/domain/test';

import { SignUpController } from './signup-controller';

const mockRequest = (): HttpRequest => {
  const password = faker.internet.password();
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
      passwordConfirmation: password,
    },
  };
};

type SutTypes = {
  sut: SignUpController
  addAccountSpy: AddAccountSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const addAccountSpy = new AddAccountSpy();
  const validationSpy = new ValidationSpy();
  const authenticationSpy = new AuthenticationSpy();

  const sut = new SignUpController(addAccountSpy, validationSpy, authenticationSpy);

  return {
    sut,
    addAccountSpy,
    validationSpy,
    authenticationSpy,
  };
};

describe('SignUp Controller', () => {
  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut();
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(addAccountSpy.addAccountParams).toEqual({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut();
    addAccountSpy.accountModel = null;
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 201 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(created(authenticationSpy.authenticationModel));
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

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut();
    const httpRequest = mockRequest();
    await sut.handle(httpRequest);
    expect(authenticationSpy.authenticationParams).toEqual({
      email: httpRequest.body.email,
      password: httpRequest.body.password,
    });
  });

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut();
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError);
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });
});
