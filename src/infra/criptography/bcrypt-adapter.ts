import bcrypt from 'bcrypt';

import { HashComparer, Hasher } from '../../data/protocols/criptography';

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number;

  constructor (salt: number) {
    this.salt = salt;
  }

  async hash (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);
    return hashedValue;
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
