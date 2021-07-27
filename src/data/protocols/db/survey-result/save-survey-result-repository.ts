import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
