import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}
