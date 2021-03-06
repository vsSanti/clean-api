import { RequestHandler } from 'express';

export const cors: RequestHandler = (req, res, next): void => {
  res.set('access-control-allow-origin', '*');
  res.set('access-control-allow-methods', '*');
  res.set('access-control-allow-headers', '*');

  next();
};
