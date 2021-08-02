import jwt from 'jsonwebtoken';

import { Decrypter, Encrypter } from '@/data/protocols/criptography';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) { }

  async encrypt (plainText: string): Promise<string> {
    const accessToken = await jwt.sign({ id: plainText }, this.secret);
    return accessToken;
  }

  async decrypt (cipherText: string): Promise<string> {
    const value = await jwt.verify(cipherText, this.secret) as string;
    return value;
  }
}
