import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount,
  Validation,
} from './signup-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, created, serverError } from '../../helpers/http-helper';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation,
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const error = this.validation.validate(body);
      if (error) {
        return badRequest(error);
      }

      const requiredFiels = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const field of requiredFiels) {
        if (!body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return created(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
