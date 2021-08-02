import bcrypt from 'bcrypt';

import { HashComparer, Hasher } from '@/data/protocols/criptography';

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) { }

  async hash (plainText: string): Promise<string> {
    const hashedValue = await bcrypt.hash(plainText, this.salt);
    return hashedValue;
  }

  async compare (plainText: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plainText, digest);
    return isValid;
  }
}
