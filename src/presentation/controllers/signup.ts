import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols';
import { MissingParamError, InvalidParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const { body } = httpRequest;

      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFiels) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password, passwordConfirmation } = body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      return {
        statusCode: 200,
        body: {},
      };
    } catch (error) {
      return serverError();
    }
  }
}
