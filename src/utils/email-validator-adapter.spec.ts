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
  it('should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);

    const isValid = sut.isValid('invalid_email@email.com');
    expect(isValid).toBe(false);
  });

  it('should return true if validator returns true', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('any_email@email.com');
    expect(isValid).toBe(true);
  });

  it('should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@email.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
