import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
  Authentication,
} from './signup-controller-protocols';
import { badRequest, created, forbidden, serverError } from '../../helpers/http/http-helper';
import { EmailInUseError } from '../../errors';

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication,
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest;

      const error = this.validation.validate(body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }

      const accessToken = await this.authentication.auth({
        email,
        password,
      });

      return created({
        accessToken,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
