import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest;

    if (!body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!body.password) {
      return badRequest(new MissingParamError('password'));
    }

    const { email } = body;

    this.emailValidator.isValid(email);
  }
}
