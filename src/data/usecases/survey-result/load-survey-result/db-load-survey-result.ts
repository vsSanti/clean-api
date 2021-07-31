import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result';
import { SurveyResultModel } from '@/domain/models';
import { LoadSurveyResult } from '@/domain/usecases/survey-result';

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) { }

  async load (surveyId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId);
    return Promise.resolve(null);
  }
}
