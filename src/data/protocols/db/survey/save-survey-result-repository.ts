import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultModel } from '@/domain/usecases';

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}
