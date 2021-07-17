import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';

export class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const { body } = httpRequest;

    if (!body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }

    if (!body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}
