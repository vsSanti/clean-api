import { Authentication } from '../../../domain/usecases';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authentication: Authentication;

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const requiredFiels = ['email', 'password'];
      for (const field of requiredFiels) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = body;

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
    } catch (error) {
      return serverError(error);
    }
  }
}
