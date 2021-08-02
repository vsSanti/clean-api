
import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import { Validation } from '@/presentation/protocols';

import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('@/validation/validators/validation-composite');

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const validations: Validation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
