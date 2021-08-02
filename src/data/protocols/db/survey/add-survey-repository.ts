import { AddSurveyParams } from '@/domain/usecases/survey';

export interface AddSurveyRepository {
  add: (data: AddSurveyParams) => Promise<void>
}
