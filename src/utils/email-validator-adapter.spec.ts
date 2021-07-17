import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

jest.mock('validator', () => {
  return {
    isEmail (): boolean {
      return true;
    },
  };
});

describe('EmailValidator Adapter', () => {
  it('return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('any_email@email.com');
    expect(isValid).toBe(true);
  });
});
