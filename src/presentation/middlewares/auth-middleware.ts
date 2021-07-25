import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';

import { HttpRequest, HttpResponse, Middleware, LoadAccountByToken } from './auth-middleware-protocols';

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string,
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const forbiddenResponse = forbidden(new AccessDeniedError());

      const accessToken = httpRequest.headers?.['x-access-token'];
      if (!accessToken) return forbiddenResponse;

      const account = await this.loadAccountByToken.load(accessToken, this.role);
      if (!account) return forbiddenResponse;

      return ok({ accountId: account.id });
    } catch (error) {
      return serverError(error);
    }
  }
}
