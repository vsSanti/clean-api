import { SurveyModel } from '../models';

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]>
}
