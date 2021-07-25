import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller';
import { Controller } from '@/presentation/protocols';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory';

import { makeAddSurveyValidation } from './add-survey-validation-factory';

export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(
    new AddSurveyController(
      makeAddSurveyValidation(),
      makeDbAddSurvey(),
    ),
  );
};
