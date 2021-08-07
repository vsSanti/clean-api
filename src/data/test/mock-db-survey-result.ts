import { SaveSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols/db/survey-result';
import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  saveSurveyResultParams: SaveSurveyResultParams;

  async save (data: SaveSurveyResultParams): Promise<void> {
    this.saveSurveyResultParams = data;
    return Promise.resolve();
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyResultModel = mockSurveyResultModel();
  surveyId: string;
  accountId: string;

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return Promise.resolve(this.surveyResultModel);
  }
}
