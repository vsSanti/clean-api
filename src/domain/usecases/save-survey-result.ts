import { SurveyResultModel } from '@/domain/models';

export type AddSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save: (data: AddSurveyResultModel) => Promise<SurveyResultModel>
}
