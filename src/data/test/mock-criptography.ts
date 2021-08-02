import faker from 'faker';
import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols/criptography';

export class DecrypterSpy implements Decrypter {
  plainText = faker.internet.password()
  cipherText: string;

  async decrypt (cipherText: string): Promise<string> {
    this.cipherText = cipherText;
    return this.plainText;
  }
}
export class EncrypterSpy implements Encrypter {
  cipherText = faker.datatype.uuid();
  plainText: string;

  async encrypt (plainText: string): Promise<string> {
    this.plainText = plainText;
    return this.cipherText;
  }
}

export class HashComparerSpy implements HashComparer {
  isValid = true;
  plainText: string;
  digest: string;

  async compare (plainText: string, digest: string): Promise<boolean> {
    this.plainText = plainText;
    this.digest = digest;
    return Promise.resolve(this.isValid);
  }
}
export class HasherSpy implements Hasher {
  digest = faker.datatype.uuid();
  plainText: string;

  async hash (plainText: string): Promise<string> {
    this.plainText = plainText;
    return Promise.resolve(this.digest);
  }
}
