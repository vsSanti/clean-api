import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper';

import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validation,
} from './login-protocols';

export class LoginController implements Controller {
  private readonly authentication: Authentication;
  private readonly validation: Validation;

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation;
    this.authentication = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const error = this.validation.validate(body);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = body;

      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }

      return ok({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
