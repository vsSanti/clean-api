import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);

  readdirSync(path.join(__dirname, '..', 'routes')).map(async (fileName) => {
    if (fileName.includes('.test.') || fileName.endsWith('.map')) return;

    (await import(`../routes/${fileName}`)).default(router);
  });
};
