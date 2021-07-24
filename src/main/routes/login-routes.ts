import { Router } from 'express';

import { adaptRoute } from '../adapters/express/express-route-adapter';
import { makeSignUpController } from '../factories/signup/signup';
import { makeLoginController } from '../factories/login/login-factory';

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()));
  router.post('/signup', adaptRoute(makeSignUpController()));
};
