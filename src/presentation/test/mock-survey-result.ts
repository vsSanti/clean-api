import { SurveyResultModel } from '@/domain/models';
import { SaveSurveyResult, SaveSurveyResultParams, LoadSurveyResult } from '@/domain/usecases/survey-result';
import { mockSurveyResultModel } from '@/domain/test';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }

  return new LoadSurveyResultStub();
};
