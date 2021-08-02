import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResult, SaveSurveyResultParams, LoadSurveyResult } from '@/domain/usecases/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  saveSurveyResultParams: SaveSurveyResultParams;

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    this.saveSurveyResultParams = data;
    return Promise.resolve(this.surveyResultModel);
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyResultModel = mockSurveyResultModel();
  surveyId: string;

  async load (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    return Promise.resolve(this.surveyResultModel);
  }
}
