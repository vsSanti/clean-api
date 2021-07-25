import jwt from 'jsonwebtoken';

import { Decrypter, Encrypter } from '../../../data/protocols/criptography';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  async decrypt (token: string): Promise<string> {
    await jwt.verify(token, this.secret);
    return null;
  }
}
