import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validation,
} from './signup-controller-protocols';
import { badRequest, created, serverError } from '../../helpers/http/http-helper';

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
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

      return created(account);
    } catch (error) {
      return serverError(error);
    }
  }
}