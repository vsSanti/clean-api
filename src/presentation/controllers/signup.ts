import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest;

    const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFiels) {
      if (!body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValidEmail = this.emailValidator.isValid(body.email);
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
